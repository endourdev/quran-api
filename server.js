const express = require('express');
const bodyParser = require('body-parser');
const port = 81;

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.get('/', (req, res, next) => {
    res.send('API OF QURAN SITE');
    next();
});

app.use(bodyParser.json());

// Route pour recevoir l'id et le chapter et envoyer une requête à un serveur externe
app.post('/api', async (req, res, next) => {
    const { id, chapter } = req.body;
    console.log(`ID Reçu : ${id}, Sourate Reçue : ${chapter}`); // Log des valeurs reçues

    try {
        const fetch = await import('node-fetch'); // Import dynamique de node-fetch
        const externalUrl = `https://api.quran.com/api/v4/chapter_recitations/${id}/${chapter}`;

        const response = await fetch.default(externalUrl, {
            method: 'GET', // ou 'POST' selon le serveur externe
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la requête au serveur externe');
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
  console.log("Listening on " + port);
});

module.exports = app;