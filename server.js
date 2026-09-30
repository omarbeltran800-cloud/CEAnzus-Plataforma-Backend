const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const xml2js = require('xml2js');
require('dotenv').config();

const app = express();
app.use(express.json());

const BBB_SERVER = process.env.BBB_SERVER_URL;
const BBB_SECRET = process.env.BBB_SHARED_SECRET;

function generateChecksum(apiCall, queryString, secret) {
    const stringToHash = apiCall + queryString + secret;
    return crypto.createHash('sha1').update(stringToHash).digest('hex');
}

// Endpoint para UNIRSE a la sesión (Genera la URL de acceso)
app.get('/api/room/join', (req, res) => {
    const { meetingID, fullName, role } = req.query; 
    const password = role === 'moderator' ? 'mp' : 'ap';

    const queryParams = `meetingID=${encodeURIComponent(meetingID)}&fullName=${encodeURIComponent(fullName)}&password=${password}`;
    const checksum = generateChecksum('join', queryParams, BBB_SECRET);

    const joinUrl = `${BBB_SERVER}api/join?${queryParams}&checksum=${checksum}`;
    res.json({ url: joinUrl });
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Backend CEAnzus corriendo en el puerto ${process.env.PORT || 3000}`);
});
