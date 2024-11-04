const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'participants.model',
        required: true,
      },
      model: {
        type: String,
        enum: ['User', 'Recruiter'],
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
        required: false,
      },
    },
  ],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: {},
  },
  lastMessageTimestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Conversation', conversationSchema);