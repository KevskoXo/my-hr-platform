// messageService/models/conversationModel.js

const mongoose = require('mongoose');

// Gesprächsmodell
const conversationSchema = new mongoose.Schema({
  participants: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'participants.model', // Referenz auf entweder User oder Recruiter
        required: true,
      },
      model: {
        type: String,
        enum: ['User', 'Recruiter'], // Geben an, ob es ein User oder Recruiter ist
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
        required: false,
      },
    },
  ],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  },
  unreadCount: {
    type: Map, // Map, um ungelesene Nachrichten pro Teilnehmer zu zählen
    of: Number,
    default: {},
  },
  lastMessageTimestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Conversation', conversationSchema);
