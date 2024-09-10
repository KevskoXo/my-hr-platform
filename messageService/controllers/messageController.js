// messageService/controllers/messageController.js

const Message = require('../models/messageModel');
const Conversation = require('../../conversationService/models/conversationModel');

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

// Nachrichten in einer Konversation abrufen
exports.getMessagesInConversation = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { conversationId } = req.params;

        const conversation = await Conversation.findById(conversationId).populate('messages');

        if (!conversation) {
            return res.status(404).json({ message: 'No conversation found' });
        }

        res.status(200).json(conversation.messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Alle Nachrichten eines Nutzers abrufen
exports.getUserMessages = async (req, res) => {
    try {
        const userId = req.user.userId;

        const messages = await Message.find({
            $or: [{ sender: userId }, { recipient: userId }]
        });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
