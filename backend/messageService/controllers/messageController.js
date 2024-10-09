// controllers/messageController.js

const Message = require('../models/messageModel');

// Senden einer Nachricht mit optionalem Medieninhalt
const sendMessage = async (req, res) => {
  try {
    const { receiverId, content, jobId, type } = req.body;
    const senderId = req.user.id;

    // Handle hochgeladene Datei
    let media = '';
    if (req.file) {
      media = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    if (!receiverId && !media) {
      return res.status(400).json({ message: 'Empfänger oder Medieninhalt sind erforderlich.' });
    }

    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      content: content || '',
      jobId: jobId || null,
      media: media || '',
      type: type || (media ? 'image' : 'text'),
    });

    await newMessage.save();

    // Emit an event via Socket.IO to send the message in real-time
    req.io.to(receiverId.toString()).emit('receiveMessage', newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Fehler beim Senden der Nachricht:', error);
    res.status(500).json({ message: 'Serverfehler beim Senden der Nachricht.' });
  }
};

// Abrufen von Nachrichten zwischen zwei Benutzern
const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    })
      .sort({ createdAt: 1 }) // Älteste zuerst
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('sender', 'name email avatar') // Benutzerinformationen einfügen
      .populate('receiver', 'name email avatar');

    const count = await Message.countDocuments({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    });

    res.status(200).json({
      messages,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Nachrichten:', error);
    res.status(500).json({ message: 'Serverfehler beim Abrufen der Nachrichten.' });
  }
};

// Markieren einer Nachricht als gelesen
const markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { messageId } = req.params;

    const message = await Message.findOne({ _id: messageId, receiver: userId });

    if (!message) {
      return res.status(404).json({ message: 'Nachricht nicht gefunden.' });
    }

    message.read = true;
    await message.save();

    res.status(200).json({ message: 'Nachricht als gelesen markiert.', data: message });
  } catch (error) {
    console.error('Fehler beim Markieren der Nachricht:', error);
    res.status(500).json({ message: 'Serverfehler beim Markieren der Nachricht.' });
  }
};

// Hinzufügen einer Reaktion zu einer Nachricht
const addReaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { messageId, reaction } = req.body;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Nachricht nicht gefunden.' });
    }

    // Prüfe, ob der Benutzer bereits eine Reaktion hinzugefügt hat
    const existingReactionIndex = message.reactions.findIndex(
      (r) => r.user.toString() === userId
    );

    if (existingReactionIndex !== -1) {
      // Aktualisiere die bestehende Reaktion
      message.reactions[existingReactionIndex].reaction = reaction;
    } else {
      // Füge eine neue Reaktion hinzu
      message.reactions.push({ user: userId, reaction });
    }

    await message.save();

    res.status(200).json({ message: 'Reaktion hinzugefügt.', data: message });
  } catch (error) {
    console.error('Fehler beim Hinzufügen der Reaktion:', error);
    res.status(500).json({ message: 'Serverfehler beim Hinzufügen der Reaktion.' });
  }
};

// Abrufen der Konversationen des aktuellen Benutzers
const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Aggregation, um die letzte Nachricht jeder Konversation zu erhalten
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: mongoose.Types.ObjectId(userId) },
            { receiver: mongoose.Types.ObjectId(userId) },
          ],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', mongoose.Types.ObjectId(userId)] },
              '$receiver',
              '$sender',
            ],
          },
          lastMessage: { $first: '$content' },
          createdAt: { $first: '$createdAt' },
        },
      },
      {
        $lookup: {
          from: 'users', // Stelle sicher, dass der Collection-Name korrekt ist
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          user: { id: '$_id', name: '$user.name', email: '$user.email', avatar: '$user.avatar' },
          lastMessage: 1,
          createdAt: 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    res.status(200).json({ conversations });
  } catch (error) {
    console.error('Fehler beim Abrufen der Konversationen:', error);
    res.status(500).json({ message: 'Serverfehler beim Abrufen der Konversationen.' });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  markAsRead,
  addReaction,
  getConversations,
};
