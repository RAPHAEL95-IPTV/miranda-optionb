const express = require('express');
const path = require('path');
const app = express();

// Serve files from frontend at the site root (e.g. /editor.html -> frontend/editor.html)
app.use(express.static(path.join(__dirname, 'frontend')));

// Also serve the same files under /frontend to support any existing absolute references like /frontend/sim.html
app.use('/frontend', express.static(path.join(__dirname, 'frontend')));

// API routes would go here (ex: app.use('/api', apiRouter)); put them BEFORE the fallback if any.

// Fallback: try to send the requested file from frontend, otherwise send index.html (SPA-friendly)
app.get('*', (req, res) => {
  const requestedPath = req.path === '/' ? '/index.html' : req.path;
  const filePath = path.join(__dirname, 'frontend', requestedPath);

  res.sendFile(filePath, (err) => {
    if (err) {
      // If requested file does not exist, return index.html so client-side routing still works
      res.sendFile(path.join(__dirname, 'frontend', 'index.html'), (err2) => {
        if (err2) {
          res.status(500).send('Erreur serveur');
        }
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur OK sur le port ${PORT}`));