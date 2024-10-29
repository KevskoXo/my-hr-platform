import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Divider, CircularProgress, Box } from '@mui/material';
import createAxiosInstance from '../services/axiosInstance'; // Import your Axios instance
import { jwtDecode } from 'jwt-decode';

const ConversationsList = ({ onSelectConversation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create an Axios instance for the 'conversations' service
  const axiosInstance = createAxiosInstance('conversations');
  const decoded = jwtDecode(localStorage.getItem('accessToken'));
  const userId = decoded.userId;
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axiosInstance.get('/user/' + userId); // Use the correct route to fetch user conversations
        setConversations(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching conversations:', error);
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
              secondary={conv.lastMessage || 'No messages'}
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </React.Fragment>
      ))}
      {conversations.length === 0 && (
        <Typography variant="body2" color="textSecondary" align="center">
          No conversations found.
        </Typography>
      )}
    </List>
  );
};

export default ConversationsList;