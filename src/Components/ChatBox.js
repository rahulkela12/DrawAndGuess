import React, { useState, useRef, useEffect } from 'react';

const ChatBox = ({ messages, onSendMessage ,socket}) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [canGuess,setCanGuess] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);
  useEffect(()=>{
    socket.on('correctGuess',({playerId})=>{
      if(playerId == socket.id) setCanGuess(false);
    });

    socket.on('drawingAccess',({playerId})=>{
      setCanGuess(socket.id !== playerId);
    })

    return ()=>{
      socket.off('correctGuess');
      socket.off('drawingAccess');
    }
  },[socket])

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-500 to-blue-100 p-4 rounded-lg shadow-lg h-full flex flex-col">
      <div className="flex-grow overflow-y-auto mb-4 bg-white rounded-lg p-3 shadow-inner">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 p-2 rounded-lg ${msg.sender === 'You' ? 'bg-blue-100 text-right' : 'bg-gray-100'}`}>
            <span className={`font-bold ${msg.sender === 'You' ? 'text-blue-600' : 'text-green-600'}`}>
              {msg.sender}:
            </span>{' '}
            <span className="text-gray-800">{msg.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="flex">
        <input
          placeholder='Guess the drawing'
          type="text"
          className="flex-grow p-2 rounded-l-lg border-2 border-blue-300 focus:outline-none focus:border-blue-500"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={!canGuess}
        />
        <button 
          type="submit" 
          disabled={!canGuess}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r-lg transition duration-300 ease-in-out"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;