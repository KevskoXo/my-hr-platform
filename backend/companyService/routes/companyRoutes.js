// companyService/routes/companyRoutes.js
const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const auth = require('../middleware/auth'); // Auth-Middleware importieren

// Route zum Anlegen eines neuen Unternehmens (nur für Recruiter)
router.post('/add', auth(['recruiter']), companyController.addCompany);

// Route zum Abrufen eines bestimmten Unternehmens anhand der ID (für alle)
router.get('/:id', auth(['viewer', 'recruiter', 'admin', 'superAdmin']), companyController.getCompanyById);

// Route zum Abrufen aller Unternehmen (für alle)
router.get('/', companyController.getAllCompanies);

// Route zum Aktualisieren eines Unternehmens (nur für Recruiter)
router.put('/:id', auth(['recruiter']), companyController.updateCompany);

// Route zum Löschen eines Unternehmens (nur für Recruiter)
router.delete('/:id', auth(['recruiter']), companyController.deleteCompany);

// Route zum Verknüpfen eines Recruiters mit einem Unternehmen (nur für Recruiter)
router.post('/:id/add-recruiter', auth(['recruiter']), companyController.addRecruiterToCompany);

module.exports = router;
