// src/components/ConversationsList.js

import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Divider, CircularProgress, Box } from '@mui/material';
import createAxiosInstance from '../services/axiosInstance'; // Importiere deine Axios-Instanz

const ConversationsList = ({ onSelectConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Erstelle eine Axios-Instanz für den 'messages' Service
  const axiosInstance = createAxiosInstance('messages');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axiosInstance.get('/conversations'); // Verwende die Instanz
        setConversations(response.data.conversations);
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
        <React.Fragment key={conv.user.id}>
          <ListItem button onClick={() => onSelectConversation(conv.user)}>
            <ListItemAvatar>
              <Avatar src={conv.user.avatar} alt={conv.user.name} />
            </ListItemAvatar>
            <ListItemText
              primary={conv.user.name}
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
