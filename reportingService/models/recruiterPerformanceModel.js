// models/recruiterPerformanceModel.js
const mongoose = require('mongoose');

// Definiere das Schema für die Performance eines Recruiters
const recruiterPerformanceSchema = new mongoose.Schema({
    recruiterId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    jobId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Job', 
        required: true 
    },
    totalApplications: { 
        type: Number, 
        default: 0 
    }, // Anzahl der Bewerbungen für die Jobanzeige
    hires: { 
        type: Number, 
        default: 0 
    }, // Anzahl der erfolgreichen Einstellungen
    interviews: { 
        type: Number, 
        default: 0 
    }, // Anzahl der Interviews für die Jobanzeige
    timeToHire: { 
        type: Number 
    }, // Zeit in Tagen bis zur Einstellung
    createdAt: { 
        type: Date, 
        default: Date.now 
    }, // Erstellungsdatum des Datensatzes
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }, // Letzte Aktualisierung
});

// Exportiere das Modell, um es in anderen Dateien zu verwenden
module.exports = mongoose.model('RecruiterPerformance', recruiterPerformanceSchema);
