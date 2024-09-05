const Resume = require('../models/resumeModel');

// Lebenslauf erstellen
exports.createResume = async (req, res) => {
    try {
        const { summary, experience, education, skills, certifications, languages } = req.body;
        const userId = req.user.id;

        // Überprüfen, ob der Nutzer bereits einen Lebenslauf hat
        const existingResume = await Resume.findOne({ user: userId });
        if (existingResume) {
            return res.status(400).json({ message: 'Resume already exists' });
        }

        // Neuen Lebenslauf erstellen
        const newResume = new Resume({
            user: userId,
            summary,
            experience,
            education,
            skills,
            certifications,
            languages,
        });

        await newResume.save();
        res.status(201).json(newResume);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lebenslauf anzeigen
exports.getResume = async (req, res) => {
    try {
        const userId = req.user.id;
        const resume = await Resume.findOne({ user: userId });

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        res.status(200).json(resume);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lebenslauf aktualisieren
exports.updateResume = async (req, res) => {
    try {
        const { summary, experience, education, skills, certifications, languages } = req.body;
        const userId = req.user.id;

        const updatedResume = await Resume.findOneAndUpdate(
            { user: userId },
            { summary, experience, education, skills, certifications, languages },
            { new: true }
        );

        if (!updatedResume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        res.status(200).json(updatedResume);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
