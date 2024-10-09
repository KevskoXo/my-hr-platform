// src/components/ChatWidget.js

import React, { useState, useEffect } from 'react';
import { Box, IconButton, Badge, Drawer, TextField, Button, List, ListItem, ListItemText, Typography } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import NotificationsIcon from '@mui/icons-material/Notifications';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]); // Liste der Nachrichten
  const [newMessage, setNewMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  // Beispiel für das Empfangen von Nachrichten (kann durch WebSockets ersetzt werden)
  useEffect(() => {
    // Simulierte neue Nachricht nach 10 Sekunden
    const timer = setTimeout(() => {
      receiveMessage({ sender: 'Admin', content: 'Willkommen im Chat!' });
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0); // Setze ungelesene Nachrichten auf 0 beim Öffnen
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() === '') return;
    setMessages([...messages, { sender: 'You', content: newMessage }]);
    setNewMessage('');
    // Hier könntest du eine API-Aufruf hinzufügen, um die Nachricht zu senden
  };

  const receiveMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    if (!isOpen) {
      setUnreadCount((prevCount) => prevCount + 1);
    }
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
          sx: { width: { xs: '100%', sm: 400 } }, // Responsive Breite
        }}
      >
        <Box sx={{ padding: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Chat</Typography>
            <IconButton onClick={toggleDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ flexGrow: 1, overflowY: 'auto', marginTop: 2 }}>
            <List>
              {messages.map((msg, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={msg.sender}
                    secondary={msg.content}
                    sx={{
                      textAlign: msg.sender === 'You' ? 'right' : 'left',
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
            <TextField
              variant="outlined"
              label="Nachricht"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              fullWidth
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  sendMessage();
                }
              }}
            />
            <IconButton color="primary" onClick={sendMessage}>
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default ChatWidget;
