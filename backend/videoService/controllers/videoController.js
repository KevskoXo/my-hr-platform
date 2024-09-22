const Video = require('../models/videoModel');
//const teamsService = require('../services/teamsService');

// Bewerbungsgespräch planen
exports.scheduleInterview = async (req, res) => {
    try {
        const { recruiterId, candidateId, startTime, endTime } = req.body;

        // E-Mails der Teilnehmer abrufen (angenommen, sie sind in der DB)
        const recruiterEmail = 'recruiter@example.com'; // Dies sollte dynamisch ermittelt werden
        const candidateEmail = 'candidate@example.com'; // Dies sollte dynamisch ermittelt werden

        // Teams-Meeting erstellen
        const meetingLink = await teamsService.createTeamsMeeting(recruiterEmail, candidateEmail, startTime, endTime);

        // Video-Datensatz in der DB speichern
        const newVideo = new Video({
            recruiter: recruiterId,
            candidate: candidateId,
            meetingLink,
            scheduledAt: startTime,
            duration: (new Date(endTime) - new Date(startTime)) / 60000 // Minuten
        });

        await newVideo.save();

        res.status(201).json({ message: 'Interview scheduled successfully', meetingLink });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Alle geplanten Interviews abrufen
exports.getAllInterviews = async (req, res) => {
    try {
        const interviews = await Video.find().populate('recruiter candidate');
        res.status(200).json(interviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Spezifisches Interview abrufen
exports.getInterviewById = async (req, res) => {
    try {
        const { id } = req.params;
        const interview = await Video.findById(id).populate('recruiter candidate');

        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        res.status(200).json(interview);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Meeting beitreten
exports.joinMeeting = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        // Das Interview anhand der ID abrufen
        const interview = await Video.findById(id);

        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        // Überprüfen, ob der Nutzer ein Teilnehmer des Meetings ist (Recruiter oder Kandidat)
        if (interview.recruiter.toString() !== userId && interview.candidate.toString() !== userId) {
            return res.status(403).json({ message: 'You are not authorized to join this meeting' });
        }

        // Meeting-Link zurückgeben
        res.status(200).json({ meetingLink: interview.meetingLink });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

