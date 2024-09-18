// models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
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
    role: {
        type: String,
        enum: ['user', 'recruiter'], // Erlaubte Rollen
        required: true,
        default: 'user', // Standardrolle ist 'user'
    },
    refreshToken: { type: String },
});

module.exports = mongoose.model('User', userSchema);
