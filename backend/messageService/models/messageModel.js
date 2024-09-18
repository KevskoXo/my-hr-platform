// messageService/models/messageModel.js

const mongoose = require('mongoose');

// Nachrichtenmodell
const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('Message', messageSchema);
