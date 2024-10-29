const Message = require('../models/messageModel');
const Conversation = require('../models/conversationModel');
const mongoose = require('mongoose');

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, content, media, type } = req.body;
    const senderId = req.user.userId; // Assuming user ID is stored in req.user

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ error: 'Invalid conversation ID' });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const newMessage = new Message({
      conversationId,
      sender: senderId,
      content,
      media,
      type,
    });

    await newMessage.save();

    // Update the last message and last activity timestamp in the conversation
    conversation.lastMessage = newMessage._id;
    conversation.lastMessageTimestamp = new Date();
    await conversation.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Error sending message' });
  }
};

// Get messages for a specific conversation
exports.getMessagesForConversation = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ error: 'Invalid conversation ID' });
    }

    const messages = await Message.find({ conversationId }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages for conversation:', error);
    res.status(500).json({ error: 'Error fetching messages for conversation' });
  }
};