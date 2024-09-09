// messageService/models/blocklistModel.js

const mongoose = require('mongoose');

// Blocklistenmodell
const blocklistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    blockedUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Geblockte Nutzer
        },
    ],
});

module.exports = mongoose.model('Blocklist', blocklistSchema);
