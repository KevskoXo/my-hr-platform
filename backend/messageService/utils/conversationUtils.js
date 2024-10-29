// utils/conversationUtils.js
const axios = require('axios');

async function checkUserInConversation(userId, conversationId, token) {
    try {
    console.log('Checking if user is in conversation:', userId, conversationId);
    console.groupCollapsed(`${process.env.CONVERSATION_SERVICE_URL}/conversations/${conversationId}`)
    //log toke
    //with text
    console.log('Token:', token);

    const response = await axios.get(
      `${process.env.CONVERSATION_SERVICE_URL}/conversations/${conversationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const conversation = response.data;
    console.log('Conversation:', conversation);
    return conversation.participants.includes(userId);
  } catch (error) {
    console.error(
      'Fehler beim Überprüfen der Konversationsteilnahme:',
      error.response ? error.response.data : error.message
    );
    return false;
  }
}

module.exports = {
  checkUserInConversation,
};