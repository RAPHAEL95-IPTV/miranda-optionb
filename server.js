const express = require("express");
const path = require("path");
const app = express();

// Sert tout le dossier frontend à la racine du site
app.use(express.static(path.join(__dirname, "frontend")));

// Page d’accueil
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// Route automatique pour toutes les pages HTML
app.get("/:page", (req, res) => {
  const file = req.params.page;
  const filePath = path.join(__dirname, "frontend", file);

  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send("Page introuvable");
    }
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});