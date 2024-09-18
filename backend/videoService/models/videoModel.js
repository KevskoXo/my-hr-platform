// videoService/models/videoModel.js

const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recruiter',
        required: true,
    },
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true,
    },
    meetingLink: {
        type: String,
        required: true, // Link zur Videokonferenz
    },
    scheduledAt: {
        type: Date,
        required: true, // Zeitpunkt des Bewerbungsgesprächs
    },
    duration: {
        type: Number, // Dauer des Interviews in Minuten
    },
    status: {
        type: String, // z.B. 'Scheduled', 'Completed', 'Cancelled'
        default: 'Scheduled',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Video', videoSchema);
