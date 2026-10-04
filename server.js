const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const crypto = require('crypto');
const axios = require('axios');
const xml2js = require('xml2js');
require('dotenv').config();

const recordingController = require('./controllers/recordingController');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static('.'));

const BBB_SERVER = process.env.BBB_SERVER_URL;
const BBB_SECRET = process.env.BBB_SHARED_SECRET;

function generateChecksum(apiCall, queryString, secret) {
    const stringToHash = apiCall + queryString + secret;
    return crypto.createHash('sha1').update(stringToHash).digest('hex');
}

app.get('/api/room/join', (req, res) => {
    const { meetingID, fullName, role } = req.query; 
    const password = role === 'moderator' ? 'mp' : 'ap';

    const queryParams = `meetingID=${encodeURIComponent(meetingID)}&fullName=${encodeURIComponent(fullName)}&password=${password}`;
    const checksum = generateChecksum('join', queryParams, BBB_SECRET);

    const joinUrl = `${BBB_SERVER}api/join?${queryParams}&checksum=${checksum}`;
    res.json({ url: joinUrl });
});

app.get('/api/recordings', recordingController.getRecordings);

io.on('connection', (socket) => {
    console.log('🟢 Nuevo usuario conectado a la pizarra:', socket.id);

    socket.on('disconnect', () => {
        console.log('🔴 Usuario desconectado:', socket.id);
    });
    // --- Sincronización de Pizarra Interactiva (HU-04) ---
    socket.on('iniciar_trazo', (datos) => {
        // broadcast envía a todos en la sala MENOS al que lo dibujó
        socket.broadcast.emit('iniciar_trazo', datos);
    });

    socket.on('dibujar', (datos) => {
        socket.broadcast.emit('dibujar', datos);
    });
});

server.listen(process.env.PORT || 3000, () => {
    console.log(`Backend CEAnzus corriendo en el puerto ${process.env.PORT || 3000}`);
});