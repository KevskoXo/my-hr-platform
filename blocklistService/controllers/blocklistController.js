// blocklistService/controllers/blocklistController.js

const Blocklist = require('../models/blocklistModel');

// Nutzer blockieren
exports.blockUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { blockedUserId } = req.body;

        let blocklist = await Blocklist.findOne({ user: userId });

        if (!blocklist) {
            blocklist = new Blocklist({
                user: userId,
                blockedUsers: [blockedUserId],
            });
        } else {
            if (!blocklist.blockedUsers.includes(blockedUserId)) {
                blocklist.blockedUsers.push(blockedUserId);
            }
        }

        await blocklist.save();

        res.status(200).json({ message: 'User blocked successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Nutzer entblockieren
exports.unblockUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { blockedUserId } = req.body;

        const blocklist = await Blocklist.findOne({ user: userId });

        if (blocklist) {
            blocklist.blockedUsers = blocklist.blockedUsers.filter(
                (id) => id.toString() !== blockedUserId
            );
            await blocklist.save();
        }

        res.status(200).json({ message: 'User unblocked successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Alle blockierten Nutzer abrufen
exports.getBlockedUsers = async (req, res) => {
    try {
        const userId = req.user.userId;

        const blocklist = await Blocklist.findOne({ user: userId }).populate('blockedUsers');

        if (!blocklist) {
            return res.status(404).json({ message: 'No blocked users found' });
        }

        res.status(200).json(blocklist.blockedUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
