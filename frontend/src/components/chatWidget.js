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
const conversationsAxiosInstance = createAxiosInstance('conversations'); // Für den ConversationsService

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
      query: { token },
    });

    socket.current.on('receiveMessage', (message) => {
      if (selectedConversation && message.conversationId === selectedConversation._id) {
        setMessages((prevMessages) => [...prevMessages, message]);
        scrollToBottom();
      } else {
        setUnreadCount((prevCount) => prevCount + 1);
      }
    });

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

    return () => {
      socket.current.disconnect();
    };
  }, [selectedConversation, typingUsers]);

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
  };

  const sendMessage = async () => {
    if (newMessage.trim() === '' && !selectedFile) return;

    const formData = new FormData();
    formData.append('conversationId', selectedConversation._id);
    formData.append('content', newMessage);
    formData.append('type', selectedFile ? 'image' : 'text');

    if (selectedFile) {
      formData.append('media', selectedFile);
    }

    try {
      const response = await axiosInstance.post('/send', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const savedMessage = response.data;
      socket.current.emit('sendMessage', {
        conversationId: savedMessage.conversationId,
        content: savedMessage.content,
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
    socket.current.emit('typing', { conversationId: selectedConversation._id });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.current.emit('stopTyping', { conversationId: selectedConversation._id });
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
                  <Avatar src={selectedConversation.participants[0].avatar} alt={selectedConversation.participants[0].name} sx={{ marginRight: 1 }} />
                  <Typography variant="h6">{selectedConversation.participants[0].name}</Typography>
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
                          justifyContent: msg.sender === 'You' ? 'flex-end' : 'flex-start',
                        }}
                      >
                        <ListItemText
                          primary={msg.sender === 'You' ? 'You' : msg.sender.name}
                          secondary={
                            <>
                              {msg.type === 'text' && <span>{msg.content}</span>}
                              {msg.type === 'image' && <img src={msg.media} alt="Gesendet" style={{ maxWidth: '100%', borderRadius: '8px' }} />}
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
                    {typingUsers.includes(selectedConversation._id) && (
                      <Typography variant="body2" color="textSecondary" sx={{ marginLeft: 'auto', marginRight: 'auto' }}>
                        {selectedConversation.participants[0].name} tippt...
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