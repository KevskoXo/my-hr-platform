// controllers/recruiterPerformanceController.js
const RecruiterPerformance = require('../models/recruiterPerformanceModel');

// Holt die Performance eines bestimmten Recruiters
exports.getRecruiterPerformance = async (req, res) => {
    try {
        const recruiterId = req.params.recruiterId;
        const performance = await RecruiterPerformance.find({ recruiterId });
        res.status(200).json(performance);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recruiter performance', error });
    }
};

// Fügt eine neue Performance-Dateneinheit hinzu (z.B. nach einer erfolgreichen Einstellung)
exports.addRecruiterPerformance = async (req, res) => {
    try {
        const newPerformance = new RecruiterPerformance(req.body);
        await newPerformance.save();
        res.status(201).json(newPerformance);
    } catch (error) {
        res.status(500).json({ message: 'Error adding recruiter performance', error });
    }
};
