// jobService/controllers/jobController.js
const axios = require('axios');
const Job = require('../models/jobModel');
const Recruiter = require('../../recruiterService/models/recruiterModel')

// Get all jobs
exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find();
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Get a single job by ID
exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a job by ID
exports.updateJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a job by ID
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json({ message: 'Job deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Job erstellen
exports.createJob = async (req, res) => {
    try {
        const { title, description, company, location, tags } = req.body;
        const recruiterId = req.user.recruiterId; // Recruiter ID aus dem JWT Token
        //console.log("recruiterId:" + recruiterId);
        
        // JWT Token extrahieren
        const token = req.headers.authorization?.split(' ')[1]; 
        
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        
        // Anfrage an den Recruiter-Service, um den Recruiter zu validieren
        const response = await axios.get(`http://localhost:5002/recruiters/${recruiterId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        // Überprüfen, ob der Recruiter existiert
        const recruiter = response.data;
        if (!recruiter) {
           return res.status(404).json({ message: 'Recruiter not found' });
        }

        // Neuen Job erstellen
        const newJob = new Job({
            title,
            description,
            company,
            recruiter: recruiterId,
            location,
            tags,
        });

        await newJob.save();
        res.status(201).json(newJob);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Jobs nach Kriterien suchen
exports.searchJobs = async (req, res) => {
    try {
        const { title, location, industry } = req.query;
        const query = {};
        if (title) query.title = new RegExp(title, 'i');
        if (location) query.location = new RegExp(location, 'i');
        if (industry) query.industry = new RegExp(industry, 'i');

        const jobs = await Job.find(query);
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};