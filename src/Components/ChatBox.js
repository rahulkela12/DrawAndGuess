import React, { useState } from 'react';

const ChatBox = ({ messages, onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    onSendMessage(message);
    setMessage('');
  };

  return (
    <div className="bg-gray-200  p-4 h-full flex flex-col">
      <div className="flex-grow overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="flex ">
        <input
          placeholder='Type Your Guess Here...'
          type="text"
          className="flex-grow w-10  p-2 border border-gray-400"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className=" bg-blue-500 text-white p-2">Send</button>
      </form>
    </div>
  );
};

export default ChatBox;
