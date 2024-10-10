// conversationsService/controllers/conversationController.js

const Conversation = require('../models/conversationModel');
const mongoose = require('mongoose');

// Create a new conversation
exports.createConversation = async (req, res) => {
  try {
    const { participants, jobId } = req.body;

    // Check if conversation between participants already exists
    const existingConversation = await Conversation.findOne({
      'participants.user': { $all: participants.map(p => p.user) },
      'participants': { $size: participants.length },
    });

    if (existingConversation) {
      return res.status(200).json(existingConversation);
    }

    const conversation = new Conversation({
      participants,
      jobId,
    });
    await conversation.save();
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ error: 'Error creating conversation' });
  }
};

// Get all conversations for a user
exports.getConversationsForUser = async (req, res) => {
  try {
    const userId = req.user.userId;

    const conversations = await Conversation.find({
      'participants.user': userId,
    })
      .sort({ lastMessageTimestamp: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching conversations' });
  }
};

// Get a specific conversation by ID
exports.getConversationById = async (req, res) => {
  try {
    const conversationId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ error: 'Invalid conversation ID' });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching conversation' });
  }
};

// Update last activity of a conversation
exports.updateLastActivity = async (req, res) => {
  try {
    const conversationId = req.params.id;
    const { lastMessageTimestamp } = req.body;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ error: 'Invalid conversation ID' });
    }

    const conversation = await Conversation.findByIdAndUpdate(conversationId, { lastMessageTimestamp }, { new: true });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ error: 'Error updating conversation' });
  }
};

// Mark a conversation as read
exports.markConversationAsRead = async (req, res) => {
  try {
    const conversationId = req.params.id;
    const userId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ error: 'Invalid conversation ID' });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Update unread count for the user
    conversation.unreadCount.set(userId, 0);
    await conversation.save();

    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ error: 'Error marking conversation as read' });
  }
};

// Delete a conversation by ID
exports.deleteConversation = async (req, res) => {
  try {
    const conversationId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ error: 'Invalid conversation ID' });
    }

    const conversation = await Conversation.findByIdAndDelete(conversationId);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.status(200).json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting conversation' });
  }
};