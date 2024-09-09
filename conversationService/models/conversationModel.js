// messageService/models/conversationModel.js

const mongoose = require('mongoose');

// Gesprächsmodell
const conversationSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Teilnehmer der Konversation
            required: true,
        },
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message', // Nachrichten in der Konversation
        },
    ],
    lastMessageAt: {
        type: Date,
        default: Date.now, // Zeitstempel der letzten Nachricht
    },
});

module.exports =  mongoose.model('Conversation', conversationSchema);
