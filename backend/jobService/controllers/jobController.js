// jobService/controllers/jobController.js
const axios = require('axios');
const Job = require('../models/jobModel');
const Recruiter = require('../../recruiterService/models/recruiterModel')

// Get all jobs with filters
exports.getAllJobs = async (req, res) => {
    try {
        const { title, location, company, tags } = req.query;

        // Filter-Objekt initialisieren
        let filter = {};

        // Filter nach Titel
        if (title) {
            filter.title = { $regex: title, $options: 'i' }; // 'i' für case-insensitive Suche
        }

        // Filter nach Standort
        if (location) {
            filter.location = { $regex: location, $options: 'i' };
        }

        // Filter nach Unternehmen
        if (company) {
            const companyObject = await Company.findOne({ name: company });
            if (companyObject) {
                filter.company = companyObject._id;
            }
        }

        // Filter nach Tags
        if (tags) {
            filter.tags = { $in: tags.split(',') };
        }

        // Jobs mit Filtern abrufen
        const jobs = await Job.find(filter);//.populate('company', 'name');
        res.status(200).json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Get a single job by ID
exports.getJobById = async (req, res) => {
  try {
      const job = await Job.findById(req.params.id).populate('recruiter', 'name email');
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


// GET /jobs/byCompany
exports.getJobsByCompany = async (req, res) => {
    try {
      const companyId = req.user.company;
  
      const jobs = await Job.find({ company: companyId })
        .populate('recruiter', 'name')
        .exec();
  
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: 'Fehler beim Abrufen der Jobs' });
    }
  };
  
  // GET /jobs/byAdmin
  exports.getJobsByAdmin = async (req, res) => {
    try {
      const companyId = req.user.company;
  
      // Jobs des Admins und der Recruiter seiner Firma
      const jobs = await Job.find({ company: companyId })
        .populate('recruiter', 'name')
        .exec();
  
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: 'Fehler beim Abrufen der Jobs' });
    }
  };
  
  // GET /jobs/byRecruiter
  exports.getJobsByRecruiter = async (req, res) => {
    try {
      const recruiterId = req.user.id;
  
      const jobs = await Job.find({ recruiter: recruiterId })
        .populate('recruiter', 'name')
        .exec();
  
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: 'Fehler beim Abrufen der Jobs' });
    }
  };
  
  // GET /jobs/byViewer
  exports.getJobsByViewer = async (req, res) => {
    try {
      const viewerId = req.user.id;
  
      const jobs = await Job.find({ assignedViewers: viewerId })
        .populate('recruiter', 'name')
        .exec();
  
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: 'Fehler beim Abrufen der Jobs' });
    }
  };
  

// jobService/controllers/jobController.js

exports.markJobAsViewed = async (req, res) => {
  const { jobId } = req.params;

  try {
      const job = await Job.findById(jobId);
      if (!job) {
          return res.status(404).json({ message: 'Job nicht gefunden' });
      }

      // Setze den newApplicantCount zurück
      job.newApplicantCount = 0;

      await job.save();

      res.status(200).json({ message: 'Neue Bewerber als angesehen markiert', job });
  } catch (error) {
      console.error('Fehler beim Aktualisieren des Job-Status:', error);
      res.status(500).json({ message: 'Fehler beim Aktualisieren des Job-Status' });
  }
};

  

// Update a job by ID
exports.updateJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const updates = req.body;

    // Optional: Berechtigungsprüfung einfügen
    // Stellen Sie sicher, dass der Benutzer berechtigt ist, diesen Job zu bearbeiten

    const job = await Job.findByIdAndUpdate(jobId, updates, { new: true });

    if (!job) {
      return res.status(404).json({ message: 'Job nicht gefunden' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Aktualisieren des Jobs' });
  }
};


// jobService/controllers/jobController.js

exports.addApplicant = async (req, res) => {
  const { jobId, applicantId } = req.body;

  try {
      const job = await Job.findById(jobId);
      if (!job) {
          return res.status(404).json({ message: 'Job nicht gefunden' });
      }

      // Beispiel: Bewerber zu einer Bewerberliste hinzufügen
      // job.applicants.push(applicantId); // Falls du eine Bewerberliste hast

      // Erhöhe die Zähler
      job.applicantCount += 1;
      job.newApplicantCount += 1;

      await job.save();

      res.status(200).json({ message: 'Bewerber hinzugefügt', job });
  } catch (error) {
      console.error('Fehler beim Hinzufügen des Bewerbers:', error);
      res.status(500).json({ message: 'Fehler beim Hinzufügen des Bewerbers' });
  }
};
