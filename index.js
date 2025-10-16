const express = require('express');
const app = express();
const pairRouter = require('./pair'); // ton fichier pair.js
const path = require('path');
const PORT = process.env.PORT || 8000;

const __path = process.cwd();

// Route HTML principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__path, 'pair.html'));
});

// Route API WhatsApp (pair)
app.use('/pair', pairRouter);  // <-- ici on monte ton router

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));