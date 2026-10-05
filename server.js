const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const crypto = require('crypto');
const axios = require('axios');
const xml2js = require('xml2js');
require('dotenv').config();
const adminMiddleware = require('./middlewares/adminMiddleware');

const SessionChat = require('./models').SessionChat;
const recordingController = require('./controllers/recordingController');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
// Endpoint de Auditoría de Chats (Exclusivo Administrador - RN01)
app.get('/api/v1/admin/chat-backups', adminMiddleware, async (req, res) => {
    try {
        const { session_id } = req.query;
        
        if (!session_id) {
            return res.status(400).json({ error: 'El parámetro session_id es obligatorio.' });
        }

        // Consultar los mensajes respaldados de la sesión
        const chats = await SessionChat.findAll({
            where: { session_id },
            order: [['created_at', 'ASC']]
        });

        // Evento de auditoría requerido por la HU-05
        console.log(`[AUDIT] admin_chat_backup_viewed - Sesión consultada: ${session_id}`);

        return res.json({
            session_id,
            retention_policy: '15 días naturales',
            total_messages: chats.length,
            messages: chats
        });
    } catch (error) {
        console.error('Error al consultar respaldos de chat:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});
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
  
    socket.on('iniciar_trazo', (datos) => {
        
        socket.broadcast.emit('iniciar_trazo', datos);
    });

    socket.on('dibujar', (datos) => {
        socket.broadcast.emit('dibujar', datos);
    });
});

server.listen(process.env.PORT || 3000, () => {
    console.log(`Backend CEAnzus corriendo en el puerto ${process.env.PORT || 3000}`);
});
const { Op } = require('sequelize');

// Tarea programada de limpieza automática a los 15 días (RN02 y RN03)
const runChatCleanup = async () => {
    try {
        const fifteenDaysAgo = new Date();
        fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

        const deletedCount = await SessionChat.destroy({
            where: {
                created_at: {
                    [Op.lt]: fifteenDaysAgo
                }
            }
        });

        if (deletedCount > 0) {
            console.log(`[CRON] Purga automática: Se eliminaron ${deletedCount} registros de chat mayores a 15 días.`);
        }
    } catch (error) {
        console.error('Error en la tarea de purga automática de chats:', error);
    }
};

// Ejecutar la limpieza cada 24 horas
setInterval(runChatCleanup, 24 * 60 * 60 * 1000);