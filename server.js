const express = require("express");
const path = require("path");
const app = express();

// Sert tous les fichiers du dossier frontend SANS montrer /frontend/ dans l'URL
app.use("/", express.static(path.join(__dirname, "frontend")));

// Route par défaut vers index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// Fix général : toutes les pages HTML sont envoyées si elles existent
app.get("/:page", (req, res) => {
  const filePath = path.join(__dirname, "frontend", req.params.page);

  res.sendFile(filePath, (err) => {
    if (err) {
      return res.status(404).send("Page introuvable");
    }
  });
});

// Démarrage Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur OK sur port ${PORT}`));