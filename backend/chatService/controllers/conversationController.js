const Conversation = require('../models/conversationModel');
const mongoose = require('mongoose');

// Create a new conversation
exports.createConversation = async (req, res) => {
  try {
    const { participants } = req.body;

    // Ensure participants array is not empty
    if (!participants || participants.length === 0) {
      return res.status(400).json({ error: 'Participants are required' });
    }

    const newConversation = new Conversation({
      participants,
    });

    await newConversation.save();
    res.status(201).json(newConversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: 'Error creating conversation' });
  }
};

// Get a conversation by its ID
exports.getConversationById = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ error: 'Invalid conversation ID' });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ error: 'Error fetching conversation' });
  }
};

// Get all conversations for a specific user
exports.getConversationsForUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const conversations = await Conversation.find({
      'participants.user': userId,
    });

    res.status(200).json(conversations);
  } catch (error) {
    console.error('Error fetching conversations for user:', error);
    res.status(500).json({ error: 'Error fetching conversations for user' });
  }
};

// Update the last activity of a conversation
exports.updateLastActivity = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ error: 'Invalid conversation ID' });
    }

    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { lastMessageTimestamp: new Date() },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.error('Error updating last activity:', error);
    res.status(500).json({ error: 'Error updating last activity' });
  }
};

// Delete a conversation by its ID
exports.deleteConversation = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ error: 'Invalid conversation ID' });
    }

    const conversation = await Conversation.findByIdAndDelete(conversationId);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.status(200).json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({ error: 'Error deleting conversation' });
  }
};

// Mark a conversation as read
exports.markConversationAsRead = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const userId = req.body.userId;

    if (!mongoose.Types.ObjectId.isValid(conversationId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid conversation ID or user ID' });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    conversation.unreadCount.set(userId, 0);
    await conversation.save();

    res.status(200).json(conversation);
  } catch (error) {
    console.error('Error marking conversation as read:', error);
    res.status(500).json({ error: 'Error marking conversation as read' });
  }
};