const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8000;
const path = require('path');

// Import ton module logique (celui qui génère le code)
const code = require('./pair');

require('events').EventEmitter.defaultMaxListeners = 500;

const __path = process.cwd();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 👉 Route pour afficher la page principale
app.get('/', (req, res) => {
  res.sendFile(path.join(__path, 'pair.html'));
});

// 👉 Route API pour générer le code
app.get('/pair', async (req, res) => {
  try {
    const number = req.query.number;
    if (!number) return res.status(400).json({ error: 'Missing number' });

    // Appel à ton script pair.js
    const response = await code.generateCode(number);

    res.json({ code: response });
  } catch (err) {
    console.error('Erreur génération code:', err);
    res.status(500).json({ error: 'Service unavailable' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

module.exports = app;