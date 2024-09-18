const mongoose = require('mongoose');

const blocklistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    blockedRecruiters: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recruiter', // Verweis auf den Recruiter
        },
    ],
});

module.exports = mongoose.model('Blocklist', blocklistSchema);
