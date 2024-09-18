// models/jobApplicationModel.js
const mongoose = require('mongoose');

// Definiere das Schema für Bewerbungen
const jobApplicationSchema = new mongoose.Schema({
    applicantId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    jobId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Job', 
        required: true 
    },
    recruiterId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, // Recruiter, der die Bewerbung verwaltet
    status: { 
        type: String, 
        enum: ['Applied', 'Interviewed', 'Hired', 'Rejected'], 
        default: 'Applied' 
    }, // Status der Bewerbung
    appliedAt: { 
        type: Date, 
        default: Date.now 
    }, // Datum der Bewerbung
    hiredAt: { 
        type: Date 
    }, // Falls eingestellt
    rejectedAt: { 
        type: Date 
    }, // Falls abgelehnt
    interviewCount: { 
        type: Number, 
        default: 0 
    }, // Anzahl der Interviews
});

// Exportiere das Modell, um es in anderen Dateien zu verwenden
module.exports = mongoose.model('JobApplication', jobApplicationSchema);
