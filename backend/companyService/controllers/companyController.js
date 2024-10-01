// companyService/controllers/companyController.js
const Company = require('../models/companyModel');
const Recruiter = require('../../recruiterService/models/recruiterModel');

// Neues Unternehmen anlegen
exports.addCompany = async (req, res) => {
    try {
        const company = new Company(req.body);
        await company.save();
        res.status(201).json(company);
    } catch (error) {
        res.status(400).json({ message: 'Error creating company', error });
    }
};


// Controller zum Abrufen aller Firmen
exports.getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find().select('name shortDescription logoUrl').lean();
        res.json(companies);
    } catch (error) {
        console.error('Error fetching companies:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


// Controller zum Abrufen einer Firma basierend auf der ID
exports.getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId)
            .select('name shortDescription longDescription logoUrl')
            .lean();

        if (!company) {
            return res.status(404).json({ error: 'Company not found' });
        }

        res.json(company);
    } catch (error) {
        console.error('Error fetching company:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Unternehmen aktualisieren
exports.updateCompany = async (req, res) => {
    try {
        const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(200).json(company);
    } catch (error) {
        res.status(400).json({ message: 'Error updating company', error });
    }
};

// Unternehmen löschen
exports.deleteCompany = async (req, res) => {
    try {
        const company = await Company.findByIdAndDelete(req.params.id);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(200).json({ message: 'Company deleted' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting company', error });
    }
};

// Recruiter zu einem Unternehmen hinzufügen
exports.addRecruiterToCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        const recruiter = await Recruiter.findById(req.body.recruiterId);
        if (!recruiter) {
            return res.status(404).json({ message: 'Recruiter not found' });
        }

        company.recruiters.push(recruiter._id);
        await company.save();

        res.status(200).json(company);
    } catch (error) {
        res.status(400).json({ message: 'Error adding recruiter to company', error });
    }
};
