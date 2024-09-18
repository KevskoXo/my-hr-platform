const mongoose = require('mongoose');

const RecruiterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    company: {
        type: mongoose.Schema.Types.ObjectId, // Referenz auf das Company-Model
        ref: 'Company',
        //required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    jobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }],
    role: {
        type: String,
        enum: ['user', 'recruiter'], // Erlaubte Rollen
        required: true,
        default: 'recruiter', // Standardrolle ist 'recruiter'
    },
    refreshToken: { type: String },
});

module.exports = mongoose.model('Recruiter', RecruiterSchema);
