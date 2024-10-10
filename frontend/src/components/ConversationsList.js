// src/components/ConversationsList.js

import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Divider, CircularProgress, Box } from '@mui/material';
import createAxiosInstance from '../services/axiosInstance'; // Importiere deine Axios-Instanz

const ConversationsList = ({ onSelectConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Erstelle eine Axios-Instanz für den 'conversations' Service
  const axiosInstance = createAxiosInstance('conversations');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axiosInstance.get('/user/' + localStorage.getItem('userId')); // Verwende die richtige Route zum Abrufen der Benutzer-Konversationen
        setConversations(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Fehler beim Abrufen der Konversationen:', error);
        setLoading(false);
      }
    };

    fetchConversations();
  }, [axiosInstance]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <List>
      {conversations.map((conv) => (
        <React.Fragment key={conv._id}>
          <ListItem button onClick={() => onSelectConversation(conv)}>
            <ListItemAvatar>
              <Avatar src={conv.participants.find((p) => p.user !== localStorage.getItem('userId')).avatar} alt={conv.participants.find((p) => p.user !== localStorage.getItem('userId')).name} />
            </ListItemAvatar>
            <ListItemText
              primary={conv.participants.find((p) => p.user !== localStorage.getItem('userId')).name}
              secondary={conv.lastMessage || 'Keine Nachrichten'}
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </React.Fragment>
      ))}
      {conversations.length === 0 && (
        <Typography variant="body2" color="textSecondary" align="center">
          Keine Konversationen gefunden.
        </Typography>
      )}
    </List>
  );
};

export default ConversationsList;