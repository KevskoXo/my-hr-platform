// controllers/jobApplicationController.js
const JobApplication = require('../models/jobApplicationModel');

// Holt alle Bewerbungen für eine bestimmte Jobanzeige
exports.getJobApplications = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const applications = await JobApplication.find({ jobId }).populate('applicantId recruiterId');
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching job applications', error });
    }
};

// Fügt eine neue Bewerbung hinzu
exports.addJobApplication = async (req, res) => {
    try {
        const newApplication = new JobApplication(req.body);
        await newApplication.save();
        res.status(201).json(newApplication);
    } catch (error) {
        res.status(500).json({ message: 'Error adding job application', error });
    }
};

// Aktualisiert den Status einer Bewerbung (z.B. auf „Interviewed“ oder „Hired“)
exports.updateApplicationStatus = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const updatedApplication = await JobApplication.findByIdAndUpdate(applicationId, req.body, { new: true });
        res.status(200).json(updatedApplication);
    } catch (error) {
        res.status(500).json({ message: 'Error updating job application status', error });
    }
};
