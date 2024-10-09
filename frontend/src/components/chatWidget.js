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
import createAxiosInstance from '../services/axiosInstance'; // Deine Axios-Instanz
import ConversationsList from './ConversationsList';

const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_SERVER_URL || 'http://localhost:5005';

const axiosInstance = createAxiosInstance('messages'); // Verwende den 'messages' Service

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [typingUsers, setTypingUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // Für Datei-Uploads

  const socket = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    // Initialisiere die Socket-Verbindung
    const token = localStorage.getItem('accessToken');
    socket.current = io(SOCKET_SERVER_URL, {
      query: { token }, // Sende das Token bei der Verbindung
    });

    // Empfang von Nachrichten
    socket.current.on('receiveMessage', (message) => {
      if (selectedUser && message.sender === selectedUser.id) {
        setMessages((prevMessages) => [...prevMessages, message]);
        scrollToBottom();
      } else {
        setUnreadCount((prevCount) => prevCount + 1);
      }
    });

    // Empfang von Typing-Status
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

    // Cleanup bei Komponentenunmount
    return () => {
      socket.current.disconnect();
    };
  }, [selectedUser, typingUsers]);

  useEffect(() => {
    if (isOpen && selectedUser) {
      fetchMessages();
    }
  }, [isOpen, selectedUser]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/${selectedUser.id}/messages`, {
        params: { page: 1, limit: 20 },
      });
      setMessages(response.data.messages);
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
      setSelectedUser(null);
      setMessages([]);
      setTypingUsers([]);
      setUnreadCount(0);
    }
  };

  const handleSelectConversation = (user) => {
    setSelectedUser(user);
    setIsOpen(true);
    setMessages([]);
    setTypingUsers([]);
    setUnreadCount(0);
  };

  const sendMessage = async () => {
    if (newMessage.trim() === '' && !selectedFile) return;

    const formData = new FormData();
    formData.append('receiverId', selectedUser.id);
    formData.append('content', newMessage);
    formData.append('type', selectedFile ? 'image' : 'text'); // Beispiel: 'image' für Bilder

    if (selectedFile) {
      formData.append('media', selectedFile);
    }

    try {
      // Sende die Nachricht über die REST-API
      const response = await axiosInstance.post('/send', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const savedMessage = response.data;

      // Sende die Nachricht über Socket.IO für Echtzeit-Kommunikation
      socket.current.emit('sendMessage', {
        receiverId: savedMessage.receiver,
        content: savedMessage.content,
        jobId: savedMessage.jobId,
        type: savedMessage.type,
        media: savedMessage.media,
      });

      setMessages((prevMessages) => [...prevMessages, savedMessage]);
      setNewMessage('');
      setSelectedFile(null);
      scrollToBottom();
    } catch (error) {
      console.error('Fehler beim Senden der Nachricht:', error);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    socket.current.emit('typing', { receiverId: selectedUser.id });

    // Setze den Typing-Timeout zurück
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.current.emit('stopTyping', { receiverId: selectedUser.id });
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

  return (
    <>
      {/* Floating Chat Icon */}
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

      {/* Chat Drawer */}
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={toggleDrawer}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 400 } }, // Responsive Breite
        }}
      >
        <Box sx={{ padding: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {selectedUser ? (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar src={selectedUser.avatar} alt={selectedUser.name} sx={{ marginRight: 1 }} />
                  <Typography variant="h6">{selectedUser.name}</Typography>
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

          {/* Inhalt */}
          {selectedUser ? (
            <>
              {/* Nachrichtenliste */}
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
                          justifyContent: msg.sender === 'You' ? 'flex-end' : 'flex-start',
                        }}
                      >
                        <ListItemText
                          primary={msg.sender === 'You' ? 'You' : msg.sender.name}
                          secondary={
                            <>
                              {msg.type === 'text' && <span>{msg.content}</span>}
                              {msg.type === 'image' && <img src={msg.media} alt="Gesendet" style={{ maxWidth: '100%', borderRadius: '8px' }} />}
                              {/* Weitere Medientypen können hier hinzugefügt werden */}
                            </>
                          }
                          sx={{
                            textAlign: msg.sender === 'You' ? 'right' : 'left',
                            maxWidth: '70%',
                            wordBreak: 'break-word',
                            backgroundColor: msg.sender === 'You' ? '#DCF8C6' : '#FFFFFF',
                            borderRadius: 2,
                            padding: 1,
                          }}
                        />
                      </ListItem>
                    ))}
                    <div ref={messagesEndRef} />
                    {/* "Is Typing" Indikator */}
                    {typingUsers.includes(selectedUser.id) && (
                      <Typography variant="body2" color="textSecondary" sx={{ marginLeft: 'auto', marginRight: 'auto' }}>
                        {selectedUser.name} tippt...
                      </Typography>
                    )}
                  </List>
                )}
              </Box>

              {/* Eingabefeld und Datei-Upload */}
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                <TextField
                  variant="outlined"
                  label="Nachricht"
                  value={newMessage}
                  onChange={handleTyping}
                  fullWidth
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
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
              {/* Anzeige ausgewählter Datei */}
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
            // Konversationsliste anzeigen, wenn kein Benutzer ausgewählt ist
            <ConversationsList onSelectConversation={handleSelectConversation} />
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default ChatWidget;
