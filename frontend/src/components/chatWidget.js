// src/components/ChatWidget.js

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  IconButton,
  Badge,
  Drawer,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Divider,
  CircularProgress,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { io } from 'socket.io-client';
import createAxiosInstance from '../services/axiosInstance';
import ConversationsList from './ConversationsList';

const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_SERVER_URL || 'http://localhost:5005';

const axiosInstance = createAxiosInstance('messages');

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [typingUsers, setTypingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const socket = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    socket.current = io(SOCKET_SERVER_URL, {
      auth: { token },
    });

    // Event-Listener für eingehende Nachrichten
    socket.current.on('newMessage', (message) => {
      if (selectedConversation && message.conversationId === selectedConversation._id) {
        setMessages((prevMessages) => [...prevMessages, message]);
        scrollToBottom();
      } else {
        setUnreadCount((prevCount) => prevCount + 1);
      }
    });

    // Event-Listener für Schreibstatus (Tippen)
    socket.current.on('typing', (data) => {
      const { senderId } = data;
      if (!typingUsers.includes(senderId)) {
        setTypingUsers((prev) => [...prev, senderId]);
      }
    });

    socket.current.on('stopTyping', (data) => {
      const { senderId } = data;
      setTypingUsers((prev) => prev.filter((id) => id !== senderId));
    });

    // Event-Listener für Fehlermeldungen
    socket.current.on('error', (error) => {
      console.error('Socket.IO-Fehler:', error);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [selectedConversation]);

  useEffect(() => {
    if (isOpen && selectedConversation) {
      fetchMessages();
    }
  }, [isOpen, selectedConversation]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/conversation/${selectedConversation._id}`);
      setMessages(response.data);
      setLoading(false);
      scrollToBottom();
      setUnreadCount(0);
    } catch (error) {
      console.error('Fehler beim Abrufen der Nachrichten:', error);
      setLoading(false);
    }
  };

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSelectedConversation(null);
      setMessages([]);
      setTypingUsers([]);
      setUnreadCount(0);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setIsOpen(true);
    setMessages([]);
    setTypingUsers([]);
    setUnreadCount(0);

    // Tritt dem Konversationsraum bei
    socket.current.emit('joinConversation', conversation._id);
  };

  const sendMessage = () => {
    if (newMessage.trim() === '' && !selectedFile) return;

    const messageData = {
      conversationId: selectedConversation._id,
      content: newMessage,
      type: selectedFile ? 'image' : 'text',
    };

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        messageData.media = reader.result; // Base64-kodierte Datei
        socket.current.emit('sendMessage', messageData);
        setMessages((prevMessages) => [...prevMessages, { ...messageData, sender: localStorage.getItem('userId') }]);
        setNewMessage('');
        setSelectedFile(null);
        scrollToBottom();
      };
      reader.readAsDataURL(selectedFile);
    } else {
      socket.current.emit('sendMessage', messageData);
      setMessages((prevMessages) => [...prevMessages, { ...messageData, sender: localStorage.getItem('userId') }]);
      setNewMessage('');
      scrollToBottom();
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (selectedConversation) {
      socket.current.emit('typing', { conversationId: selectedConversation._id });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (selectedConversation) {
        socket.current.emit('stopTyping', { conversationId: selectedConversation._id });
      }
    }, 3000);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Hilfsfunktion, um den anderen Teilnehmer zu erhalten
  const getOtherParticipant = (participants) => {
    return participants.find((p) => p.user !== localStorage.getItem('userId'));
  };

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        <IconButton color="primary" onClick={toggleDrawer}>
          <Badge badgeContent={unreadCount} color="secondary">
            <ChatIcon fontSize="large" />
          </Badge>
        </IconButton>
      </Box>

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={toggleDrawer}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 400 } },
        }}
      >
        <Box sx={{ padding: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {selectedConversation ? (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {(() => {
                    const otherParticipant = getOtherParticipant(selectedConversation.participants);
                    return (
                      <>
                        <Avatar src={otherParticipant.avatar} alt={otherParticipant.name} sx={{ marginRight: 1 }} />
                        <Typography variant="h6">{otherParticipant.name}</Typography>
                      </>
                    );
                  })()}
                </Box>
                <IconButton onClick={toggleDrawer}>
                  <CloseIcon />
                </IconButton>
              </>
            ) : (
              <>
                <Typography variant="h6">Konversationen</Typography>
                <IconButton onClick={toggleDrawer}>
                  <CloseIcon />
                </IconButton>
              </>
            )}
          </Box>

          {selectedConversation ? (
            <>
              <Box sx={{ flexGrow: 1, overflowY: 'auto', marginTop: 2 }}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <List>
                    {messages.map((msg, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          justifyContent: msg.sender === localStorage.getItem('userId') ? 'flex-end' : 'flex-start',
                        }}
                      >
                        <ListItemText
                          primary={msg.sender === localStorage.getItem('userId') ? 'Du' : msg.senderName || 'Anonym'}
                          secondary={
                            <>
                              {msg.type === 'text' && <span>{msg.content}</span>}
                              {msg.type === 'image' && (
                                <img src={msg.media} alt="Gesendet" style={{ maxWidth: '100%', borderRadius: '8px' }} />
                              )}
                            </>
                          }
                          sx={{
                            textAlign: msg.sender === localStorage.getItem('userId') ? 'right' : 'left',
                            maxWidth: '70%',
                            wordBreak: 'break-word',
                            backgroundColor:
                              msg.sender === localStorage.getItem('userId') ? '#DCF8C6' : '#FFFFFF',
                            borderRadius: 2,
                            padding: 1,
                          }}
                        />
                      </ListItem>
                    ))}
                    <div ref={messagesEndRef} />
                    {typingUsers.length > 0 && (
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ marginLeft: 'auto', marginRight: 'auto' }}
                      >
                        {typingUsers.map((id) => id).join(', ')} tippt...
                      </Typography>
                    )}
                  </List>
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                <TextField
                  variant="outlined"
                  label="Nachricht"
                  value={newMessage}
                  onChange={handleTyping}
                  fullWidth
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault(); // Verhindert Zeilenumbruch
                      sendMessage();
                    }
                  }}
                />
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="upload-file"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="upload-file">
                  <IconButton component="span" color="primary">
                    📎
                  </IconButton>
                </label>
                <IconButton color="primary" onClick={sendMessage}>
                  <SendIcon />
                </IconButton>
              </Box>
              {selectedFile && (
                <Box sx={{ marginTop: 1, display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2">{selectedFile.name}</Typography>
                  <IconButton size="small" onClick={() => setSelectedFile(null)}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </>
          ) : (
            <ConversationsList onSelectConversation={handleSelectConversation} />
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default ChatWidget;
