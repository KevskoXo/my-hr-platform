const Recruiter = require('../models/recruiterModel');
const Company = require('../../companyService/models/companyModel'); // Für das Verknüpfen von Unternehmen
const Job = require('../../jobService/models/jobModel');  //für populate jobs
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {generateAccessToken, generateRefreshToken} = require('../utils/tokenUtils')

// Recruiter erstellen  !!!!!wahrscheinlich ood!!!!!
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
            subscription: {
                status: 'trial',
                startDate: new Date(),
                endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 Tage Trial
            },
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

// superAdmin initial erstellen und Firma referenzieren
exports.registerSuperAdmin = async (req, res) => {
    try {
        const { name, email, password, secretToken, companyId } = req.body;

        // Überprüfe das geheime Token
        if (secretToken !== process.env.SUPERADMIN_SECRET) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        // Prüfe, ob der SuperAdmin bereits existiert
        const existingSuperAdmin = await Recruiter.findOne({ email });
        if (existingSuperAdmin) {
            return res.status(400).json({ error: 'SuperAdmin already exists' });
        }

        // Passwort hashen
        const hashedPassword = await bcrypt.hash(password, 10);

        // Neuen SuperAdmin erstellen und mit Firma verknüpfen
        const newSuperAdmin = new Recruiter({
            name,
            email,
            password: hashedPassword,
            role: 'superAdmin',
            company: companyId, // Referenz auf die vom CompanyService erstellte Firma
            subscription: {
                status: 'trial',
                startDate: new Date(),
                endDate: null,
            },
        });

        await newSuperAdmin.save();

        res.status(201).json({ message: 'SuperAdmin registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Admin von SuperAdmin anlegen lassen
exports.createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Überprüfen, ob der Benutzer SuperAdmin ist
        if (req.user.role !== 'superAdmin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        // Prüfen, ob der Admin bereits existiert
        const existingAdmin = await Recruiter.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ error: 'Admin already exists' });
        }

        // Passwort hashen
        const hashedPassword = await bcrypt.hash(password, 10);

        // Neuen Admin erstellen, Firma referenzieren und SuperAdmin als Vorgesetzten festlegen
        const newAdmin = new Recruiter({
            name,
            email,
            password: hashedPassword,
            role: 'admin',
            company: req.user.company, // Firma vom SuperAdmin übernehmen
            supervisor: req.user.userId, // SuperAdmin als Vorgesetzten festlegen
            subscription: {
                status: 'active',
                startDate: new Date(),
                endDate: null,
            },
        });

        await newAdmin.save();

        res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Recruiter von Admin oder SuperAdmin anlegen lassen
exports.createRecruiter = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Überprüfen, ob der Benutzer Admin oder SuperAdmin ist
        if (req.user.role !== 'admin' && req.user.role !== 'superAdmin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        // Prüfen, ob der Recruiter bereits existiert
        const existingRecruiter = await Recruiter.findOne({ email });
        if (existingRecruiter) {
            return res.status(400).json({ error: 'Recruiter already exists' });
        }

        // Passwort hashen
        const hashedPassword = await bcrypt.hash(password, 10);

        // Neuen Recruiter erstellen, Firma referenzieren und Vorgesetzten festlegen
        const newRecruiter = new Recruiter({
            name,
            email,
            password: hashedPassword,
            role: 'recruiter',
            company: req.user.company, // Firma übernehmen
            subscription: {
                status: 'active',
                startDate: new Date(),
                endDate: null,
            },
            supervisor: req.user.userId, // Admin oder SuperAdmin als Vorgesetzten festlegen
        });


        await newRecruiter.save();

        res.status(201).json({ message: 'Recruiter created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Viewer von Admin, Recruiter oder SuperAdmin anlegen lassen
exports.createViewer = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Überprüfen, ob der Benutzer Admin oder SuperAdmin ist
        if (req.user.role !== 'admin' && req.user.role !== 'superAdmin' && req.user.role !== 'recruiter') {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        // Prüfen, ob der Viewer bereits existiert
        const existingViewer = await Recruiter.findOne({ email });
        if (existingViewer) {
            return res.status(400).json({ error: 'Viewer already exists' });
        }

        // Passwort hashen
        const hashedPassword = await bcrypt.hash(password, 10);

        // Neuen Viewer erstellen, Firma referenzieren und Vorgesetzten festlegen
        const newViewer = new Recruiter({
            name,
            email,
            password: hashedPassword,
            role: 'viewer',
            company: req.user.company, // Firma übernehmen
            subscription: {
                status: 'viewer',
                startDate: new Date(),
                endDate: null,
            },
            supervisor: req.user.userId, // Admin oder SuperAdmin als Vorgesetzten festlegen
        });

        await newViewer.save();

        res.status(201).json({ message: 'Viewer created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getRecruiterHierarchy = async (req, res) => {
    try {
        const recruiterId = req.user.userId;
        const companyId = req.user.company;
        const role = req.user.role;
        let hierarchyData;

        if (role === 'superAdmin') {
            // SuperAdmin sieht alle unter sich
            hierarchyData = await buildHierarchy(recruiterId, companyId, role);
        } else if (role === 'admin') {
            // Admin sieht alle unter sich, aber nicht seine Vorgesetzten
            hierarchyData = await buildHierarchy(recruiterId, companyId, role, false);
        } else if (role === 'recruiter') {
            // Recruiter sieht nur sich selbst
            hierarchyData = await buildHierarchy(recruiterId, companyId, role, false);
        } else {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        res.json(hierarchyData);
    } catch (error) {
        console.error('Error fetching recruiter hierarchy:', error);
        res.status(500).json({ error: 'Server error' });
    }
};




async function buildHierarchy(recruiterId, companyId, role, includeSupervisors = false, visited = new Set()) {
    // Vermeidung von Endlosschleifen durch Zyklus-Erkennung
    if (visited.has(recruiterId.toString())) {
        return null;
    }
    visited.add(recruiterId.toString());

    // Aktuellen Recruiter abrufen
    const recruiter = await Recruiter.findOne({ _id: recruiterId, company: companyId })
        .select('name role avatar supervisor')
        .lean();

    if (!recruiter) {
        return null;
    }

    // Untergeordnete Recruiter abrufen (nur wenn Rolle nicht 'recruiter')
    let subordinates = [];
    if (role !== 'recruiter') {
        subordinates = await Recruiter.find({ supervisor: recruiterId, company: companyId })
            .select('_id')
            .lean();
    }

    // Rekursiv die Hierarchie der Untergeordneten aufbauen
    const childrenPromises = subordinates.map(subordinate =>
        buildHierarchy(subordinate._id, companyId, role, false, visited)
    );
    let children = (await Promise.all(childrenPromises)).filter(child => child !== null);

    // Nur für SuperAdmins: Wenn includeSupervisors true ist, fügen wir den Vorgesetzten hinzu
    if (includeSupervisors && role === 'superAdmin' && recruiter.supervisor) {
        const supervisorHierarchy = await buildHierarchy(recruiter.supervisor, companyId, role, true, visited);
        if (supervisorHierarchy) {
            // Der Vorgesetzte wird an den Anfang der Kinderliste gesetzt
            children = [supervisorHierarchy, ...children];
        }
    }

    return {
        ...recruiter,
        _id: recruiter._id.toString(), // IDs als Strings
        children,
    };
}



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

//// geschützte route get profile
//exports.getRecruiterProfile = async (req, res) => {
//    try {
//        const recruiter = await Recruiter.findById(req.user.recruiterId).select('-password');
//        res.json(recruiter);
//    } catch (error) {
//        res.status(500).json({ error: error.message });
//    }
//};

// controllers/recruiterController.js

exports.getRecruiterProfile = async (req, res) => {
    try {
        const recruiterId = req.user.userId;

        // Überprüfen, ob der angemeldete Benutzer auf dieses Profil zugreifen darf
        if (req.user.id !== recruiterId && req.user.role !== 'superAdmin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const recruiter = await Recruiter.findById(recruiterId).select('name email role avatar').lean();

        if (!recruiter) {
            return res.status(404).json({ error: 'Recruiter not found' });
        }

        res.json(recruiter);
    } catch (error) {
        console.error('Fehler beim Abrufen des Recruiter-Profils:', error);
        res.status(500).json({ error: 'Serverfehler' });
    }
};

// get avata-url
exports.getRecruiterAvatar = async (req, res) => {
    try {
        const recruiterId = req.user.userId;
        const recruiter = await Recruiter.findById(recruiterId).select('avatar').lean();

        if (!recruiter) {
            return res.status(404).json({ error: 'Recruiter not found' });
        }
        res.json(recruiter);
    }   catch (error) {
        console.error('Fehler beim Abrufen des Recruiter-Profils:', error);
        res.status(500).json({ error: 'Serverfehler' });
    }
}

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
        role: recruiter.role,
        name: recruiter.name,
        email: recruiter.email,
        company: recruiter.company
      });
    } catch (err) {
      res.status(500).json({ error: 'Serverfehler' });
    }
  };
  

// Supervisor ändern
exports.updateSupervisor = async (req, res) => {
  try {
    const recruiterId = req.params.id;
    let { supervisor } = req.body;
    
    // Recruiter-Details abrufen
    const recruiter = await Recruiter.findById(supervisor);

    if (recruiter.role === 'recruiter') {
      supervisor = recruiter.supervisor.toString();
    }

    // Überprüfen Sie, ob der Benutzer berechtigt ist
    if (req.user.role !== 'superAdmin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Validierung: Verhindern Sie Zyklen in der Hierarchie
    if (await createsCycle(recruiterId, supervisor)) {
      return res.status(400).json({ error: 'Cannot assign supervisor due to cycle' });
    }

    await Recruiter.findByIdAndUpdate(recruiterId, { supervisor });

    res.json({ message: 'Supervisor updated successfully' });
  } catch (error) {
    console.error('Error updating supervisor:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Hilfsfunktion zur Zykluserkennung
const createsCycle = async (recruiterId, supervisorId) => {
  // Implementieren Sie die Logik, um zu überprüfen, ob ein Zyklus entstehen würde
  // Z.B. könnten Sie die Vorgesetztenkette bis zum Wurzelknoten durchlaufen
  // und prüfen, ob recruiterId irgendwo in der Kette vorkommt
};


// Backend: Hole den Supervisor des aktuellen Benutzers
exports.getCurrentUserSupervisor = async (req, res) => {
    try {
        const supervisor = await Recruiter.findById(req.user.userId)
            .select('supervisor')
            .populate('supervisor', 'name role avatar')
            .lean();

        if (!supervisor || !supervisor.supervisor) {
            return res.status(404).json({ error: 'Supervisor not found' });
        }

        res.json(supervisor.supervisor);
    } catch (error) {
        console.error('Error fetching supervisor:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// GET /recruiters
exports.getRecruiters = async (req, res) => {
    try {
      const companyId = req.user.company;
  
      const recruiters = await Recruiter.find({ company: companyId }).select('name');
  
      res.json(recruiters);
    } catch (error) {
      res.status(500).json({ message: 'Fehler beim Abrufen der Recruiter' });
    }
  };

  
  // Controller zum Abrufen von Viewern
exports.getViewers = async (req, res) => {
    try {
        const companyId = req.user.company; // Annahme: Benutzer sind einem Unternehmen zugeordnet

        // Suche nach Recruitern mit der Rolle 'viewer' innerhalb des Unternehmens
        const viewers = await Recruiter.find({ company: companyId, role: 'viewer' }).select('name email');

        res.status(200).json(viewers);
    } catch (error) {
        console.error('Fehler beim Abrufen der Viewer:', error);
        res.status(500).json({ error: 'Serverfehler beim Abrufen der Viewer' });
    }
};