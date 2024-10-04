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
    hasNewApplicants: {
        type: Boolean,
        default: false,
    },
    applicantCount: {
        type: Number,
        default: 0,
    },
    assignedViewers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Viewer',
        },
    ],
    skills: [{
        type: String,
        enum: ['JavaScript', 'Python', 'React', 'Node.js', 'Machine Learning', 'Projektmanagement', 'Marketing', 'Vertrieb', 'Finanzen', 'HR', 'Design', 'Andere'],
    }],
});

module.exports = mongoose.model('Job', jobSchema);
