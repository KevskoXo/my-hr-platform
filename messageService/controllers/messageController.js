// messageService/controllers/messageController.js

const Message = require('../models/messageModel');
const Conversation = require('../models/conversationModel');

// Nachricht senden
exports.sendMessage = async (req, res) => {
    try {
        const { recipientId, content } = req.body;
        const senderId = req.user.userId;

        // Nachricht erstellen
        const newMessage = new Message({
            sender: senderId,
            recipient: recipientId,
            content,
        });

        await newMessage.save();

        // Konversation aktualisieren oder erstellen
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, recipientId] }
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, recipientId],
                messages: [newMessage._id],
                lastMessageAt: newMessage.timestamp,
            });
        } else {
            conversation.messages.push(newMessage._id);
            conversation.lastMessageAt = newMessage.timestamp;
        }

        await conversation.save();

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Nachrichtenverlauf abrufen
exports.getConversation = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { participantId } = req.params;

        const conversation = await Conversation.findOne({
            participants: { $all: [userId, participantId] }
        }).populate('messages');

        if (!conversation) {
            return res.status(404).json({ message: 'No conversation found' });
        }

        res.status(200).json(conversation.messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Alle Konversationen des Nutzers abrufen
exports.getAllConversations = async (req, res) => {
    try {
        const userId = req.user.userId;

        const conversations = await Conversation.find({
            participants: userId
        }).populate('participants messages');

        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
