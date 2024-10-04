// recruiterService/routes/recruiterRoutes.js

const express = require('express');
const router = express.Router();
const recruiterController = require('../controllers/recruiterController');
const auth = require('../middleware/auth'); // Auth-Middleware importieren

// Route zum Erstellen eines Recruiters (öffentlich)
router.post('/register', recruiterController.registerRecruiter);

// Registrierungsroute für SuperAdmin
router.post('/register-superadmin', recruiterController.registerSuperAdmin);

// Registrierungsroute für admins
router.post('/create-admin', auth(['superAdmin']), recruiterController.createAdmin);

// Registrierungsroute für recruiter
router.post('/create-recruiter', auth(['admin', 'superAdmin']), recruiterController.createRecruiter);

// Registrierungsroute für viewer
router.post('/create-viewer', auth(['recruiter', 'admin', 'superAdmin']), recruiterController.createViewer);

// Route zum Login (öffentlich)
router.post('/login', recruiterController.loginRecruiter);

// GET /recruiters
router.get('/recruiters', auth(['superAdmin', 'admin']), recruiterController.getRecruiters);

// Route zum Verknüpfen eines Recruiters mit einem Unternehmen (nur für Recruiter)
router.post('/assign-company', auth(['recruiter']), recruiterController.assignCompanyToRecruiter);

// Geschützte Route, nur zugänglich mit gültigem Token (nur für Recruiter)
router.get('/profile', auth(['recruiter', 'admin', 'superAdmin']), recruiterController.getRecruiterProfile);

// Refresh Token Route (öffentlich)
router.post('/refresh-token', recruiterController.refreshToken);

// Logout Route (geschützt)
router.post('/logout', auth(['recruiter']), recruiterController.logout);

router.post('/authenticate', recruiterController.authenticateRecruiter);

// hierarchy abfragen
router.get('/hierarchy', auth(['superAdmin', 'admin', 'recruiter']), recruiterController.getRecruiterHierarchy);

// Route zum abrufen des supervisors
router.get('/current-supervisor', auth(['recruiter', 'admin']), recruiterController.getCurrentUserSupervisor);

// Route zum Abrufen eines Recruiters nach ID (öffentlich)
router.get('/:id', recruiterController.getRecruiterById);

router.put('/:id/supervisor', auth(['superAdmin']), recruiterController.updateSupervisor);


module.exports = router;
