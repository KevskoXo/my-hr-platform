const Recruiter = require('../models/recruiterModel');
const Company = require('../../companyService/models/companyModel'); // Für das Verknüpfen von Unternehmen
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Recruiter erstellen
exports.registerRecruiter = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Überprüfen, ob der Recruiter bereits existiert
        const existingRecruiter = await Recruiter.findOne({ email });
        if (existingRecruiter) {
            return res.status(400).json({ error: 'Recruiter already exists' });
        }

        // Passwort hashen
        const hashedPassword = await bcrypt.hash(password, 10);

        // Neuen Recruiter erstellen
        const newRecruiter = new Recruiter({
            name,
            email,
            password: hashedPassword,
        });

        await newRecruiter.save();

        res.status(201).json({ message: 'Recruiter registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Recruiter nach ID abrufen
exports.getRecruiterById = async (req, res) => {
    try {
        const { id } = req.params;
        const recruiter = await Recruiter.findById(id).populate('company').populate('jobs');
        if (!recruiter) return res.status(404).json({ message: 'Recruiter not found' });
        res.status(200).json(recruiter);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Recruiter einem Unternehmen zuordnen
exports.assignCompanyToRecruiter = async (req, res) => {
    try {
        const { recruiterId, companyId } = req.body;
        const recruiter = await Recruiter.findById(recruiterId);
        if (!recruiter) return res.status(404).json({ message: 'Recruiter not found' });

        const company = await Company.findById(companyId);
        if (!company) return res.status(404).json({ message: 'Company not found' });

        recruiter.company = companyId;
        await recruiter.save();

        res.status(200).json(recruiter);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.loginRecruiter = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Recruiter in der Datenbank suchen
        const recruiter = await Recruiter.findOne({ email });
        if (!recruiter) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Passwort überprüfen
        const isMatch = await bcrypt.compare(password, recruiter.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // JWT-Token erstellen
        const token = jwt.sign(
            { recruiterId: recruiter._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// geschützte route get profile
exports.getRecruiterProfile = async (req, res) => {
    try {
        const recruiter = await Recruiter.findById(req.user.recruiterId).select('-password');
        res.json(recruiter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};