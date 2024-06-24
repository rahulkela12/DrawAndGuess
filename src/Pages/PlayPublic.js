import React, { useEffect } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import TopBar from "../Components/TopBar";
import Leaderboard from "../Components/Leaderboard";
import ChatBox from "../Components/ChatBox";
import DrawingBoard from "../Components/DrawingBoard";

const PlayPublic = () => {
  const [players, setPlayers] = useState([
    { name: "JesusIsTheWay", points: 300 },
    { name: "Cinnamoroll", points: 365 },
    { name: "littlekid7778", points: 0 },
    { name: "obama", points: 0 },
    { name: "jio", points: 0 },
    { name: "bob", points: 0 },
    { name: "myush", points: 0 },
    { name: "hi", points: 0 },
  ]);
  const { state } = useLocation();
  console.log(state);

  useEffect(()=>{
    const player = {
      name:`${state.name}(you)`,
      points:0
    }
    setPlayers([...players,player]);
  },[state]);

  const [messages, setMessages] = useState([
    "bob joined the room!",
    "myush joined the room!",
    "hi joined the room!",
  ]);

  const handleSendMessage = (message) => {
    setMessages([...messages, message]);
  };

  return (
    <>
        <div className="flex items-center  justify-center mt-20 ">
          <div className="w-full max-w-9xl  shadow-lg rounded-lg">
            <TopBar />
            <div className="flex h-[calc(100vh-13rem)]">
              <div className="w-1/4 mt-1 mr-0.5 flex-shrink-0 overflow-y-auto p-2">
                <Leaderboard players={players} />
              </div>
              <div className="flex-1 mt-1   flex flex-col p-2 ">
                <DrawingBoard />
              </div>
              <div className="w-1/4 mt-1 ml-0.5 flex-shrink-0 flex flex-col p-2">
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
};

export default PlayPublic;
