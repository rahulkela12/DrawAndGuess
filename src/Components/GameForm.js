import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { io } from "socket.io-client";

const socket = io('http://localhost:5000')

const GameForm = ({name}) => {
  const [players, setPlayers] = useState(2);
  const [language, setLanguage] = useState('English');
  const [drawTime, setDrawTime] = useState(80);
  const [rounds, setRounds] = useState(3);
  const [wordMode, setWordMode] = useState('Normal');
  const [wordCount, setWordCount] = useState(3);
  const [hints, setHints] = useState(2);
  const [messages, setMessages] = useState("");

  const navigate = useNavigate();
  
  const onMessage = (message) => {
    console.log("Received message:", message);
    setMessages(message);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // console.log({
    //   players,
    //   language,
    //   drawTime,
    //   rounds,
    //   wordMode,
    //   wordCount,
    //   hints
    // });
    // Add your form submission logic here
    const state = {
      code:hints,name
    }
    socket.emit('privateCreate',{players,hints,name,create:true});
    socket.on("used",onMessage);
    if(messages === "")
    navigate('/privatePlay',{state});
    else
    toast.error(messages);
  };

  return (
    
    <form onSubmit={handleSubmit} className="bg-slate-600 p-6 rounded-lg shadow-md space-y-4 flex-1">
      <div className="flex justify-between items-center">
        <label className=" text-white font-medium">Players</label>
        <input 
          type="number" 
          max={8}
          min={2}
          value={players} 
          onChange={(e) => setPlayers(e.target.value)} 
          className="border p-2 rounded w-80"
        />
      </div>
      <div className="flex justify-between items-center mt-4">
        <label className=" text-white font-medium">Language</label>
        <input 
          type="text" 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)} 
          className="border p-2 rounded w-80"
        />
      </div>
      <div className="flex justify-between items-center mt-4">
        <label className=" text-white font-medium">Drawtime</label>
        <input 
          type="number" 
          value={drawTime} 
          onChange={(e) => setDrawTime(e.target.value)} 
          className="border p-2 rounded w-80"
        />
      </div>
      <div className="flex justify-between items-center mt-4">
        <label className=" text-white font-medium">Rounds</label>
        <input 
          type="number" 
          value={rounds} 
          onChange={(e) => setRounds(e.target.value)} 
          className="border p-2 rounded w-80"
        />
      </div>
      <div className="flex justify-between items-center mt-4">
        <label className=" text-white font-medium">Word Mode</label>
        <input 
          type="text" 
          value={wordMode} 
          onChange={(e) => setWordMode(e.target.value)} 
          className="border p-2 rounded w-80"
        />
      </div>
      <div className="flex justify-between items-center mt-4">
        <label className=" text-white font-medium">Word Count</label>
        <input 
          type="number"  
          value={wordCount} 
          onChange={(e) => setWordCount(e.target.value)} 
          className="border p-2 rounded w-80"
        />
      </div>
      <div className="flex justify-between items-center mt-4">
        <label className=" text-white font-medium">Hints</label>
        <input 
          type="number" 
          value={hints} 
          onChange={(e) => setHints(e.target.value)} 
          className="border p-2 rounded w-80"
        />
      </div>
      <button type="submit" className="bg-green-500 text-white p-2 rounded w-full hover:bg-green-700 min-h-10 h-14 mt-3">
        Start!
      </button>
    </form>

  );
};

export default GameForm;

