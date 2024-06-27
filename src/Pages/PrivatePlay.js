import { useEffect } from "react";
import { useState,useCallback,useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopBar from "../Components/TopBar";
import Leaderboard from "../Components/Leaderboard";
import ChatBox from "../Components/ChatBox";
import DrawingBoard from "../Components/DrawingBoard"; 
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const socket = io('http://localhost:5000')

const PrivatePlay = () => {
  const [privatePlayers, setPrivatePlayers] = useState([]);
  const [messages, setMessages] = useState([]);
  const {state} = useLocation();
  const hasJoined = useRef(false);

  const navigate = useNavigate();

  useEffect(() => {
    console.log(state);
    if (state && state.name && !hasJoined.current) {  
      console.log("Joining with name:", state.name);
      socket.emit('joinPrivate', { name: state.name,roomId:state.code});
      hasJoined.current = true;
    }
    
    const onPlayerList = (players) => {
      console.log("Received player list:", players);
      setPrivatePlayers(players);
    };
    socket.on("NoRoomFound",(message)=>{
       toast.error(message.message);
       navigate("/"); 
    })
    socket.on("RoomFull",(message)=>{
        toast.error(message.text);
        navigate("/"); 
     })

    const onMessage = (message) => {
      console.log("Received message:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    };
    socket.on('playerList', onPlayerList);
    socket.on('message', onMessage);

    return () => {
      socket.off('playerList', onPlayerList);
      socket.off('message', onMessage);
    };
  }, [state]);


  const handleSendMessage = useCallback((message) => {
    // console.log("Sending message:", message);
    socket.emit('messagePrivate', message);
  }, []);
  

  // useEffect(() => {
  //   if (state && state.name) {
  //     const newPlayer = { name: state.name, points: 0 };
  //     setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
  //     setMessages((prevMessages) => [...prevMessages, `${state.name} joined the room!`]);
  //   }
  // }, [state]);

  // console.log(state);

  return (
    <>
        <div className="flex items-center  justify-center mt-20 ">
          <div className="w-full max-w-9xl  shadow-lg rounded-lg">
            <TopBar />
            <div className="flex h-[calc(100vh-13rem)]">
              <div className="w-1/4 mt-1 mr-0.5 flex-shrink-0 overflow-y-auto p-2">
                <Leaderboard players={privatePlayers} />
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

export default PrivatePlay;