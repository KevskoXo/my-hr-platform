// server.js

const http = require('http');
const dotenv = require('dotenv');
dotenv.config();

const app = require('./app'); // Importiere die Express-App aus app.js

// Erstelle den HTTP-Server mit der importierten App
const server = http.createServer(app);

// Initialisiere Socket.IO
const socket = require('./socket');
socket.init(server); // Übergebe den Server an die init-Funktion

// Exportiere den Server
module.exports = server;
