import { Express } from "express";
import userService from "../services/userService";
import { Client } from "discord.js";

function setup(app: Express, client: Client): void {
    app.get("/users", async (req, res) => {
      try {
        const authorization = req.headers.authorization;
        if (authorization !== `Bearer ${process.env.WEBHOOK_SECRET}`) {
          return res.status(401).json({ error: "Non autorisé" });
        }
    
        const users = await userService.getAllUsers();
        if (users === null) {
          return res.status(400).json({ error: "Users were not found" });
        }
    
        res.json(users)
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur interne" });
      }
    });
}

export default setup;