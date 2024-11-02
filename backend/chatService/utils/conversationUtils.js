const axios = require('axios');

async function checkUserInConversation(userId, conversationId, token) {
  try {
    console.log('Checking user in conversation:', userId, conversationId);
    console.log('Conversation service URL:', process.env.CONVERSATION_SERVICE_URL);
    const response = await axios.get(
      `${process.env.CONVERSATION_SERVICE_URL}/conversations/${conversationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('Conversation:', response.data);
    const conversation = response.data;
    return conversation.participants.some(participant => participant.user.toString() === userId);
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