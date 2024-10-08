// messageService/app.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const messageRoutes = require('./routes/messageRoutes');
const Message = require('./models/messageModel');
const { server, io } = require('./server'); // Importiere den Server und Socket.IO-Instanz

dotenv.config(); // Lade Umgebungsvariablen aus der .env-Datei

const app = express();

// Stelle sicher, dass das Upload-Verzeichnis existiert
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// CORS-Konfiguration
const corsOptions = {
  origin: 'http://localhost:3000', // Ersetze dies durch die URL deiner Frontend-Anwendung
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Ermöglicht das Senden von Cookies und anderen Credentials
};

app.use(cors(corsOptions)); // Wende die CORS-Optionen an

// Middleware für JSON-Parsing
app.use(express.json());

// Statische Dateien bereitstellen (für hochgeladene Medien)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Verbinde mit MongoDB
mongoose.connect(process.env.MONGO_URI_MESSAGE)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Socket.IO Verbindungen und Ereignisse
io.on('connection', (socket) => {
  if (!socket.user) {
    console.error('User information is not available after authentication');
    socket.disconnect();
    return;
  }

  console.log(`Benutzer verbunden: ${socket.user.id}`);

  // Benutzer zu einem Raum hinzufügen, basierend auf ihrer Benutzer-ID
  socket.join(socket.user.id);

  // Event zum Empfangen von Nachrichten
  socket.on('sendMessage', async (data) => {
    const { receiverId, content, jobId, media, type } = data;
    const senderId = socket.user.id;

    if (!receiverId && !media) {
      console.error('Receiver ID or media is required to send a message');
      return;
    }

    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      content: content || '',
      jobId: jobId || null,
      media: media || '',
      type: type || 'text',
    });

    await newMessage.save();

    // Sende die Nachricht an den Empfänger
    io.to(receiverId.toString()).emit('receiveMessage', newMessage);
  });

  // Event zum Anzeigen des Typing-Status
  socket.on('typing', (data) => {
    const { receiverId } = data;
    io.to(receiverId.toString()).emit('typing', { senderId: socket.user.id });
  });

  // Event zum Stoppen des Typing-Status
  socket.on('stopTyping', (data) => {
    const { receiverId } = data;
    io.to(receiverId.toString()).emit('stopTyping', { senderId: socket.user.id });
  });

  // Trennung der Verbindung
  socket.on('disconnect', () => {
    console.log(`Benutzer getrennt: ${socket.user.id}`);
  });
});

// Routen
app.use('/messages', messageRoutes);

// Basis-Route
app.get('/', (req, res) => {
  res.send('MessageService läuft!');
});

// Server starten
const PORT = process.env.PORT_MESSAGE || 5005;
server.listen(PORT, () => console.log(`MessageService running on port ${PORT}`));
