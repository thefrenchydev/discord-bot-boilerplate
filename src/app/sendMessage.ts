import { Express } from "express";
import { Client } from "discord.js";

function setup(app: Express, client: Client): void {
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
}

export default setup;