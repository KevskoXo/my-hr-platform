// models/diversityMetricsModel.js
const mongoose = require('mongoose');

// Definiere das Schema für Diversitätsmetriken
const diversityMetricsSchema = new mongoose.Schema({
    jobId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Job', 
        required: true 
    },
    applicantId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    gender: { 
        type: String, 
        enum: ['Male', 'Female', 'Non-binary', 'Other'], 
        required: true 
    }, // Geschlecht des Bewerbers
    age: { 
        type: Number, 
        required: true 
    }, // Alter des Bewerbers
    ethnicity: { 
        type: String, 
        required: true 
    }, // Ethnische Zugehörigkeit
    applicationDate: { 
        type: Date, 
        default: Date.now 
    }, // Datum der Bewerbung
});

// Exportiere das Modell, um es in anderen Dateien zu verwenden
module.exports = mongoose.model('DiversityMetrics', diversityMetricsSchema);
