import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import GameForm from '../Components/GameForm'; 
import TopBar from '../Components/TopBar';
import Leaderboard from '../Components/Leaderboard';
import ChatBox from '../Components/ChatBox';

const PlayPrivate = () => {
  const [players, setPlayers] = useState([
    { name: "You", points: 0 },
  ]);
  const { state } = useLocation();
  console.log(state.name);

  useEffect(()=>{
    const player = {
      name:`${state.name}(you)`,
      points:0
    }
    setPlayers([player]);
  },[state]);

  const [messages, setMessages] = useState([
  ]); 

  const handleSendMessage = (message) => {
    setMessages([...messages, message]);
  };

  return (
    <>
        <div className="flex items-center  justify-center mt-20">
        <div className="w-full max-w-9xl  shadow-lg rounded-lg">
          <TopBar />
          <div className="flex h-[calc(100vh-13rem)]">
              <div className="w-1/4 mt-1 mr-0.5 flex-shrink-0 overflow-y-auto p-1">
                <Leaderboard players={players} />
              </div>
         <div className="flex-1 mt-1  flex flex-col p-1">
         <GameForm />
         </div>
         <div className="w-1/4 mt-1  flex-shrink-0 flex flex-col overflow-y-auto p-1">
                <ChatBox
                  messages={messages}
                  onSendMessage={handleSendMessage}
                />
              </div>

      </div>
      </div>
      </div>
    </>
  );
}

export default PlayPrivate;
