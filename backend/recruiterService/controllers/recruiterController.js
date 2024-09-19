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

        // Refresh Token als HttpOnly-Cookie setzen
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true, // Aktiviere dies, wenn du HTTPS verwendest
            sameSite: 'Strict', // Schützt vor CSRF-Angriffen
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Tage in Millisekunden
        });

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

        // Refresh Token als HttpOnly-Cookie setzen
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true, // Aktiviere dies, wenn du HTTPS verwendest
            sameSite: 'Strict', // Schützt vor CSRF-Angriffen
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Tage in Millisekunden
        });

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
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        // Benutzer anhand des Refresh Tokens finden
        const recruiter = await Recruiter.findOne({ refreshToken });
        if (!recruiter) {
            return res.status(403).json({ error: 'Invalid refresh token' });
        }

        // Refresh Token verifizieren
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
            if (err || recruiter._id.toString() !== decoded.recruiterId) {
                return res.status(403).json({ error: 'Invalid refresh token' });
            }

            // Neues Access Token generieren
            const newAccessToken = generateAccessToken(recruiter);
            res.json({ accessToken: newAccessToken });
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

//recruiter logout
exports.logout = async (req, res) => {
    try {
        const recruiter = await Recruiter.findById(req.recruiter.recruiterId);
        if (recruiter) {
            recruiter.refreshToken = null;
            await recruiter.save();
        }

        res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'Strict' });
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

//authenticate recruiter
exports.authenticateRecruiter = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Recruiter anhand der E-Mail finden
      const recruiter = await Recruiter.findOne({ email });
      if (!recruiter) {
        return res.status(404).json({ error: 'Recruiter nicht gefunden' });
      }
  
      // Passwort überprüfen
      const isMatch = await bcrypt.compare(password, recruiter.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
      }
  
      // Recruiterinformationen zurückgeben
      res.json({
        userId: recruiter._id,
        role: 'recruiter',
        name: recruiter.name,
        email: recruiter.email,
      });
    } catch (err) {
      res.status(500).json({ error: 'Serverfehler' });
    }
  };
  