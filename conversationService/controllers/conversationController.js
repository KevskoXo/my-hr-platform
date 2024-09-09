const Conversation = require('../models/conversationModel');

// Neue Konversation erstellen
exports.createConversation = async (req, res) => {
    try {
        const { participants } = req.body; // Array von User IDs (Recruiter und Bewerber)
        
        // Überprüfen, ob eine Konversation zwischen diesen Nutzern bereits existiert
        const existingConversation = await Conversation.findOne({ participants: { $all: participants } });
        
        if (existingConversation) {
            return res.status(400).json({ message: 'Conversation already exists' });
        }
        
        // Neue Konversation erstellen
        const newConversation = new Conversation({
            participants
        });
        
        await newConversation.save();
        res.status(201).json(newConversation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Konversationen eines Nutzers abrufen
exports.getUserConversations = async (req, res) => {
    try {
        const userId = req.user.userId;
        const conversations = await Conversation.find({ participants: userId }).populate('participants', 'name');
        
        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eine spezifische Konversation abrufen
exports.getConversationById = async (req, res) => {
    try {
        const conversationId = req.params.id;
        const conversation = await Conversation.findById(conversationId).populate('participants', 'name');
        
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }
        
        res.status(200).json(conversation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
