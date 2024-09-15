// models/jobApplicationModel.js
const mongoose = require('mongoose');

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
    },
    hiredAt: { 
        type: Date 
    },
    rejectedAt: { 
        type: Date 
    },
    interviewCount: { 
        type: Number, 
        default: 0 
    },
});

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
