const Recruiter = require('../models/recruiterModel');
const Company = require('../../companyService/models/companyModel'); // Für das Verknüpfen von Unternehmen
const Job = require('../../jobService/models/jobModel');  //für populate jobs
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {generateAccessToken, generateRefreshToken} = require('../utils/tokenUtils')

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

        //JWT-Token
        const accessToken = generateAccessToken(recruiter);
        const refreshToken = generateRefreshToken(recruiter);
 
        recruiter.refreshToken = refreshToken;

        await newRecruiter.save();

        res.status(201).json({ message: 'Recruiter registered successfully' , accessToken, refreshToken});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Recruiter nach ID abrufen
exports.getRecruiterById = async (req, res) => {
    try {
        const { id } = req.params;
        const recruiter = await Recruiter.findById(id);//.populate('company').populate('jobs');
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
       // JWT-Token plus refreshToken erstellen 
       const accessToken = generateAccessToken(recruiter);
       const refreshToken = generateRefreshToken(recruiter);

       recruiter.refreshToken = refreshToken;
       await recruiter.save();

        //console.log(token);
        res.json({ refreshToken, accessToken });
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


//Token-refresh
exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ error: 'No token provided' });

    try {
        const recruiter = await recruiter.findOne({ refreshToken });
        if (!user) return res.status(403).json({ error: 'Invalid refresh token' });

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
            if (err || recruiter._id.toString() !== decoded.userId) {
                return res.status(403).json({ error: 'Invalid refresh token' });
            }

            const newAccessToken = generateAccessToken(user);
            res.json({ accessToken: newAccessToken });
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

//recruiter logout
exports.logout = async (req, res) => {
    try {
        const recruiter = await Recruiter.findById(req.recruiter.userId);
        if (!recruiter) {
            return res.status(404).json({ error: 'Recruiter not found' });
        }
        recruiter.refreshToken = null;
        await recruiter.save();
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};