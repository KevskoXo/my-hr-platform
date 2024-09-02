// jobService/models/Job.js

const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    company: {
        type: mongoose.Schema.Types.ObjectId, // Referenz auf das Company-Model
        ref: 'Company',
        required: true,
    },
    recruiter: {
        type: mongoose.Schema.Types.ObjectId, // Referenz auf das Recruiter-Model
        ref: 'Recruiter',
        required: true,
    },
    location: {
        type: String,
    },
    tags: [String], // Tags zum Filtern
    datePosted: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Job', jobSchema);
