// companyService/routes/companyRoutes.js
const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');

// Route zum Anlegen eines neuen Unternehmens
router.post('/add', companyController.addCompany);

// Route zum Abrufen aller Unternehmen
router.get('/', companyController.getAllCompanies);

// Route zum Abrufen eines bestimmten Unternehmens anhand der ID
router.get('/:id', companyController.getCompanyById);

// Route zum Aktualisieren eines Unternehmens
router.put('/:id', companyController.updateCompany);

// Route zum Löschen eines Unternehmens
router.delete('/:id', companyController.deleteCompany);

// Route zum Verknüpfen eines Recruiters mit einem Unternehmen
router.post('/:id/add-recruiter', companyController.addRecruiterToCompany);

module.exports = router;
