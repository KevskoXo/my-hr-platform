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

// Alle Unternehmen abrufen
exports.getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find().populate('recruiters');
        res.status(200).json(companies);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching companies', error });
    }
};

// Ein bestimmtes Unternehmen anhand der ID abrufen
exports.getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id).populate('recruiters');
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(200).json(company);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching company', error });
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
