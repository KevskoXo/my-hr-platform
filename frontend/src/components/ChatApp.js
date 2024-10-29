import React, { useState } from 'react';
import ConversationsList from './ConversationsList';
import ChatWidget from './ChatWidget';

const ChatApp = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  return (
    <div className="chat-app">
      <ConversationsList onSelectConversation={handleSelectConversation} />
      {selectedConversation && (
        <ChatWidget conversationId={selectedConversation._id} />
      )}
    </div>
  );
};

export default ChatApp;