import React, { useState } from 'react';
import ChatWidget from './ChatWidget';

const ChatApp = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  return (
    <div className="chat-app">
      <ChatWidget
        selectedConversation={selectedConversation}
        onSelectConversation={handleSelectConversation}
      />
    </div>
  );
};

export default ChatApp;