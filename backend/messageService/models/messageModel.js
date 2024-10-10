// models/Message.js

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'senderModel',
    required: true,
  },
  senderModel: {
    type: String,
    required: true,
    enum: ['User', 'Recruiter'],
  },
  content: {
    type: String,
    required: false, // Optional, wenn Medien gesendet werden
  },
  media: {
    type: String, // URL zur Mediendatei (z.B. Bild, Video)
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  readBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'senderModel', // Referenz auf die Benutzer (User oder Recruiter), die die Nachricht gelesen haben
    },
  ],
  type: {
    type: String,
    enum: ['text', 'image', 'video', 'file'],
    default: 'text',
  },
  reactions: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'senderModel',
      },
      reaction: {
        type: String, // z.B. 'like', 'love', 'laugh'
      },
    },
  ],
});

module.exports = mongoose.model('Message', messageSchema);
