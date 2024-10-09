// models/Message.js

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referenz auf das User-Modell
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referenz auf das User-Modell
    required: true,
  },
  content: {
    type: String,
    required: false, // Optional, wenn Medien gesendet werden
  },
  media: {
    type: String, // URL zur Mediendatei (z.B. Bild, Video)
    required: false,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job', // Optional, falls Nachrichten jobbezogen sind
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,
  },
  // Erweiterungen
  type: {
    type: String,
    enum: ['text', 'image', 'video', 'file'],
    default: 'text',
  },
  reactions: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      reaction: {
        type: String, // z.B. 'like', 'love', 'laugh'
      },
    },
  ],
});

module.exports = mongoose.model('Message', messageSchema);
