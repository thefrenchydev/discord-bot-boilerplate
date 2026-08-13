import { Express } from "express";
import userService from "../services/userService";
import { Client } from "discord.js";

function setup(app: Express, client: Client): void {
    app.post("/users", async (req, res) => {
      try {
        const authorization = req.headers.authorization;
        if (authorization !== `Bearer ${process.env.WEBHOOK_SECRET}`) {
          return res.status(401).json({ error: "Non autorisé" });
        }
    
        const userId = req.body.userId;
        if (typeof userId !== "string") {
          return res.status(400).json({ error: "ID utilisateur invalide" });
        }
    
        const user = await userService.getUserByRobloxId(userId)
        if (user === null) {
          return res.status(400).json({ error: "ID utilisateur non trouvé" });
        }
    
        res.json(user);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur interne" });
      }
    });
}

export default setup;