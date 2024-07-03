import React, { useEffect } from "react";
import { useState,useCallback,useRef } from "react";
import { useLocation } from "react-router-dom";
import TopBar from "../Components/TopBar";
import Leaderboard from "../Components/Leaderboard";
import ChatBox from "../Components/ChatBox";
import DrawingBoard from "../Components/DrawingBoard";
import { io } from "socket.io-client";

const socket = io('http://localhost:5000')

const PlayPublic = () => {
  const [players, setPlayers] = useState([]);
  const [selectedWord, setSelectedWord] = useState("");
  const [messages, setMessages] = useState([]);
  const {state} = useLocation();
  const hasJoined = useRef(false);
  const [canDraw, setCanDraw] = useState(false);
  const [drawer, setDrawer] = useState(null);
  const [isWordSelected, setIsWordSelected] = useState(false); 
  const [drawerId,setDrawerId] = useState();
  const [timeLeft, setTimeLeft] = useState(60);
  const [round, setRound] = useState(1);
  const [totalRounds,setTotalRounds] = useState(3);

  useEffect(() => {
    socket.on('drawingAccess', ({ playerId, playerName,round,totalRounds }) => {
      setCanDraw(socket.id === playerId);
      setIsWordSelected(false);
      setSelectedWord("");
      setDrawerId(playerId);
      setDrawer(playerName);
      setRound(round);
      setTotalRounds(totalRounds);
      alert(`Now ${playerName} has access to draw`);
    });

    socket.on('roundStart',({round,totalRounds,timeLeft})=>{
      setRound(round);
      setTotalRounds(totalRounds);
      setTimeLeft(timeLeft);
    });

    socket.on('timerUpdate',(newTimeLeft)=>{
      setTimeLeft(newTimeLeft);
    });

    socket.on('endGame',()=>{
      alert('Game over');
    })

    return () => {
      socket.off('drawingAccess');
      socket.off('roundStart');
      socket.off('timerUpdate');
      socket.off('gameEnd');
    };
  }, [socket]);

  useEffect(() => {
    if (state && state.name && !hasJoined.current) {
      console.log("Joining with name:", state.name);
      socket.emit('join', { name: state.name });
      hasJoined.current = true;
    }

    const onPlayerList = (players) => {
      console.log("Received player list:", players);
      setPlayers(players);
    };

    const onMessage = (message) => {
      console.log("Received message:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on('playerList', onPlayerList);
    socket.on('message', onMessage);

    socket.on('word',({word})=>{
      console.log(word);
      setSelectedWord(word);
      setIsWordSelected(true);
    });

    return () => {
      socket.off('playerList', onPlayerList);
      socket.off('message', onMessage);
    };
  }, [state]);


  const handleSendMessage = useCallback((message) => {
    socket.emit('message', message);
  }, []);
  


  return (
    <>
        <div className="flex items-center  justify-center mt-20 ">
          <div className="w-full max-w-9xl  shadow-lg rounded-lg">
            <TopBar timeLeft={timeLeft} round={round} totalRounds={totalRounds} />
            <div className="flex h-[calc(100vh-13rem)]">
              <div className="w-1/4 mt-1 mr-0.5 flex-shrink-0 overflow-y-auto p-2">
                <Leaderboard players={players} self={socket.id} drawerId={drawerId}/>
              </div>
              <div className="flex-1 mt-1 flex flex-col p-2 ">
                <DrawingBoard socket={socket} canDraw={canDraw} drawer={drawer} setSelectedWord={setSelectedWord}
                  isWordSelected={isWordSelected} setIsWordSelected={setIsWordSelected}
                />
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
