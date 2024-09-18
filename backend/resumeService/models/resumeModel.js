const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    summary: {
        type: String, // Kurzbeschreibung des Nutzers
        required: true,
    },
    experience: [ // Berufserfahrung
        {
            jobTitle: String,
            company: String,
            startDate: Date,
            endDate: Date,
            description: String,
        },
    ],
    education: [ // Bildung
        {
            degree: String,
            institution: String,
            startDate: Date,
            endDate: Date,
        },
    ],
    skills: [String], // Liste der Fähigkeiten
    certifications: [ // Zertifikate
        {
            name: String,
            institution: String,
            date: Date,
        },
    ],
    languages: [ // Sprachkenntnisse
        {
            language: String,
            proficiency: String, // z.B. Muttersprache, Fließend, Grundkenntnisse
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Resume', resumeSchema);
