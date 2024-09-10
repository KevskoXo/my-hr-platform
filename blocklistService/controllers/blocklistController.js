// blocklistService/controllers/blocklistController.js

const Blocklist = require('../models/blocklistModel');

// Recruiter blockieren
exports.blockRecruiter = async (req, res) => {
    try {
        const userId = req.user.userId; // Der User, der blockiert
        const { recruiterId } = req.body; // Der Recruiter, der blockiert wird

        let blocklist = await Blocklist.findOne({ user: userId });

        if (!blocklist) {
            blocklist = new Blocklist({
                user: userId,
                blockedRecruiters: [recruiterId], // Blockierte Recruiter
            });
        } else {
            if (!blocklist.blockedRecruiters.includes(recruiterId)) {
                blocklist.blockedRecruiters.push(recruiterId);
            }
        }

        await blocklist.save();

        res.status(200).json({ message: 'Recruiter successfully blocked' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Recruiter entblockieren
exports.unblockRecruiter = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { recruiterId } = req.body;

        const blocklist = await Blocklist.findOne({ user: userId });

        if (blocklist) {
            blocklist.blockedRecruiters = blocklist.blockedRecruiters.filter(
                (id) => id.toString() !== recruiterId
            );
            await blocklist.save();
        }

        res.status(200).json({ message: 'Recruiter successfully unblocked' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Alle blockierten Recruiter abrufen
exports.getBlockedRecruiters = async (req, res) => {
    try {
        const userId = req.user.userId;

        const blocklist = await Blocklist.findOne({ user: userId }).populate('blockedRecruiters');

        if (!blocklist) {
            return res.status(404).json({ message: 'No blocked recruiters found' });
        }

        res.status(200).json(blocklist.blockedRecruiters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
