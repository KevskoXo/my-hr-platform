// controllers/diversityMetricsController.js
const DiversityMetrics = require('../models/diversityMetricsModel');

// Holt alle Diversitätsmetriken für eine bestimmte Jobanzeige
exports.getDiversityMetrics = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const metrics = await DiversityMetrics.find({ jobId });
        res.status(200).json(metrics);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching diversity metrics', error });
    }
};

// Fügt neue Diversitätsmetriken hinzu
exports.addDiversityMetrics = async (req, res) => {
    try {
        const newMetrics = new DiversityMetrics(req.body);
        await newMetrics.save();
        res.status(201).json(newMetrics);
    } catch (error) {
        res.status(500).json({ message: 'Error adding diversity metrics', error });
    }
};
