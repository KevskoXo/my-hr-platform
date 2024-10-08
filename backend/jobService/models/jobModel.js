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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    },
    recruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recruiter',
        required: true,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
        },
    },
    tags: [String],
    datePosted: {
        type: Date,
        default: Date.now,
    },
    newApplicantCount: {
        type: Number,
        default: 0,
    },
    applicantCount: {
        type: Number,
        default: 0,
    },
    assignedViewers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recruiter',
        },
    ],
    skills: [{
        type: String,
    }],
    tasks: [{
        type: String,
    }],
    startDate: {
        type: Date,
    },
    employmentType: {
        type: String,
        enum: ['Vollzeit', 'Teilzeit', 'Freelance', 'Praktikum', 'Werkstudent', 'Andere'],
    },
    salary: {
        type: Number,
        required: true,
        min: 0,
    },
    videoUrl: {
        type: String,
    },
});

// Index für Geolocation hinzufügen
jobSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Job', jobSchema);
