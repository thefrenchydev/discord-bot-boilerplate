import { Client, GatewayIntentBits } from 'discord.js';
import fs from 'fs';
import path from 'path';
import express from "express";
import connectDB from './utils/database';
import dotenv from 'dotenv';
dotenv.config();

const TOKEN = process.env.TOKEN;

if (!TOKEN) {
  throw new Error('Missing TOKEN in environment variables');
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.AutoModerationExecution,
  ],
});

// Dynamically read event files
const eventFiles = fs
  .readdirSync(path.join(__dirname, 'events'))
  .filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

const app = express();

app.use(express.json({ limit: "20kb" }));

app.post("/webhook", async (req, res) => {
  try {
    const authorization = req.headers.authorization;

    if (authorization !== `Bearer ${process.env.WEBHOOK_SECRET}`) {
      return res.status(401).json({ error: "Non autorisé" });
    }

    const message = req.body.message;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Message invalide" });
    }

    const channel = await client.channels.fetch(
      process.env.DISCORD_CHANNEL_ID ?? ""
    );

    if (!channel?.isSendable()) {
      return res.status(500).json({ error: "Salon Discord invalide" });
    }

    const discordMessage = await channel.send({
      content: message.slice(0, 2000),
      allowedMentions: { parse: [] }
    });

    res.json({
      success: true,
      messageId: discordMessage.id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur interne" });
  }
});

(async () => {
  for (const file of eventFiles) {
    const filePath = path.join(__dirname, 'events', file);
    const module = await import(filePath);
    const event = module.default;
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }

  await connectDB(); //db connect
  await client.login(TOKEN);

  const PORT = Number(process.env.PORT) || 3000;

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`API disponible sur http://localhost:${PORT}`);
  });
})();
