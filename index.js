const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8000;

// Import du module code (API)
const code = require('./pair');
require('events').EventEmitter.defaultMaxListeners = 500;

// Middleware pour parser le JSON et les formulaires
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route pour l'API du code
app.use('/code', code);

// Servir pair.html pour la racine et /pair
app.get(['/', '/pair'], (req, res) => {
    res.sendFile(path.join(process.cwd(), 'pair.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;