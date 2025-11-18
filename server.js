// server.js — version corrigée, simple, fiable pour Render
const express = require("express");
const path = require("path");

const app = express();

// Active JSON pour API
app.use(express.json());

// Sert le dossier frontend correctement
app.use(express.static(path.join(__dirname, "frontend")));

// Page d’accueil -> index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// Catch-all pour toutes les pages HTML
app.get("/:page", (req, res) => {
  const file = req.params.page;

  // Sert directement la page demandée si elle existe
  res.sendFile(
    path.join(__dirname, "frontend", file),
    (err) => {
      if (err) {
        res.status(404).send("Page introuvable");
      }
    }
  );
});

// Lancement serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🚀 Serveur en ligne sur le port " + PORT));