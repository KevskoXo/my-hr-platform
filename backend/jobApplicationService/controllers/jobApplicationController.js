// controllers/jobApplicationController.js
const JobApplication = require('../models/jobApplicationModel');

// Holt alle Bewerbungen für eine bestimmte Jobanzeige
const axios = require('axios');

exports.getJobApplications = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const applications = await JobApplication.find({ jobId });

        // Holen der User- und Recruiter-Daten für jede Bewerbung
        const populatedApplications = await Promise.all(applications.map(async (app) => {
            const applicantResponse = await axios.get(`http://localhost:5000/users/${app.applicantId}`); // Anfrage an den UserService
            const recruiterResponse = await axios.get(`http://localhost:5002/recruiters/${app.recruiterId}`); // Anfrage an den RecruiterService
            
            return {
                ...app._doc,
                applicant: applicantResponse.data,
                recruiter: recruiterResponse.data
            };
        }));

        res.status(200).json(populatedApplications);
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
