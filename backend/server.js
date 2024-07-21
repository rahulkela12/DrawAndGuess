const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");

const server = http.createServer(app);
app.use(cors());

const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const ROOM_SIZE = 3;
const rooms = {};
const playerRooms = {};

const privateRooms = {};
const privatePlayerRoom = {};
const privateRoomSize = {};

const drawingAcess = {};

const round_time = 80;
const total_rounds = 3;

const roomTimers = {};
const roomRounds = {};

const currentWords={};
const correctGuessesPerRound = {};

const max_points = 500;
const min_points = 100;


function calculatePoints(timeLeft){
  return Math.max(min_points,Math.floor(max_points*(timeLeft/round_time)));
}
function calculateDrawerPoints(correctGuesses, totalPlayers) {
  const maxDrawerPoints = 300; // Adjust this value as needed
  const pointsPerGuess = maxDrawerPoints / (totalPlayers - 1); // Subtract 1 to exclude the drawer
  return Math.floor(correctGuesses * pointsPerGuess);
}
function allUsersGuessed(room) {
  let totalPlayers;
  if(rooms[room]){
   totalPlayers = rooms[room].length;
  }
  else{
   totalPlayers = privateRooms[room].length;
  }
  const correctGuesses = correctGuessesPerRound[room];
  return correctGuesses === totalPlayers - 1; // Subtract 1 to exclude the drawer
}

const startGame = (room)=>{
  console.log("reached");
  roomRounds[room] = 1;
  startRound(room);

}

const startRound=(room)=>{
  
  if (roomTimers[room]) {
    clearInterval(roomTimers[room]);
  }
  if(rooms[room]){
  selectRadnomDrawer(room);
  }
  if(privateRooms[room]){
    selectRadnomPrivateDrawer(room);
  }
  roomTimers[room] = round_time;
  correctGuessesPerRound[room] = 0;
  io.to(room).emit('roundStart',{
    round:roomRounds[room],
    totalRounds: total_rounds,
    timeLeft: round_time
  });


  const timer = setInterval(()=>{
    roomTimers[room]--;
    io.to(room).emit('timerUpdate',roomTimers[room]);

    if(roomTimers[room] <=0 || allUsersGuessed(room)){
      clearInterval(timer);
      endRound(room);
    }
  },1000);
};

const endRound=(room)=>{
  let drawerIndex;
  if(rooms[room]){
    drawerIndex = rooms[room].findIndex(player => player.id === drawingAcess[room]);
    if(drawerIndex !== -1){
      const drawerPoints = calculateDrawerPoints(correctGuessesPerRound[room],rooms[room].length);
      rooms[room][drawerIndex].points += drawerPoints;
      io.to(room).emit("message",{
        sender: "System",
        text:`${rooms[room][drawerIndex].name} got ${drawerPoints} points for ${correctGuessesPerRound[room]} correct guesses!`
      });
      io.to(room).emit('playerList',rooms[room]);
    }
  }
  if(privateRooms[room]){
    drawerIndex = privateRooms[room].findIndex(player => player.id === drawingAcess[room]);
    if(drawerIndex !== -1){
      const drawerPoints = calculateDrawerPoints(correctGuessesPerRound[room],privateRooms[room].length);
      privateRooms[room][drawerIndex].points += drawerPoints;
      io.to(room).emit("message",{
        sender: "System",
        text:`${privateRooms[room][drawerIndex].name} got ${drawerPoints} points for ${correctGuessesPerRound[room]} correct guesses!`
      });
      io.to(room).emit('playerList',privateRooms[room]);
    }
  }
  if(roomRounds[room] < total_rounds){
    roomRounds[room]++;
    startRound(room);
  }else{
    endGame(room);
  }
};

const endGame =(room)=>{
  let finalScores;
  if(rooms[room]){
   finalScores = rooms[room].sort((a,b) => b.points - a.points);
  }
  if(privateRooms[room]){
    finalScores = privateRooms[room].sort((a,b) => b.points - a.points);
  }
  const winner = finalScores[0];
  io.to(room).emit('gameOver',{
    winner : winner,
    finalScores: finalScores
  });
  // delete roomTimers[room];
  // delete roomRounds[room];
  // delete roomDrawnPlayers[room];
}

const getRoom = () => {
  const roomIds = Object.keys(rooms);
  for (let room of roomIds) {
    if (rooms[room].length < ROOM_SIZE) return room;
  }
  const newRoom = `room-${roomIds.length + 1}`;
  rooms[newRoom] = [];
  return newRoom;
};

const selectRadnomDrawer = (room) => {

  const players = rooms[room];
  if (players && players.length === ROOM_SIZE) {
    const randomIndex = Math.floor(Math.random() * players.length);
    const randomPlayer = players[randomIndex];
    drawingAcess[room] = randomPlayer.id;
    console.log(randomPlayer.name);

    io.to(room).emit("drawingAccess", {
      playerId: randomPlayer.id,
      playerName: randomPlayer.name,
      round:roomRounds[room],
      totalRounds:total_rounds
    });

  }
};

const selectRadnomPrivateDrawer = (room) => {
  const players = privateRooms[room];
  if (players && players.length === privateRoomSize[room]) {
    const randomIndex = Math.floor(Math.random() * players.length);
    const randomPlayer = players[randomIndex];
    drawingAcess[room] = randomPlayer.id;
    io.to(room).emit("drawingAccess", {
      playerId: randomPlayer.id,
      playerName: randomPlayer.name,
    });
  }
};

io.on("connection", (socket) => {

  socket.on("startPath", (data) => {
    const room = playerRooms[socket.id];
    const proom = privatePlayerRoom[socket.id];
    if (room && drawingAcess[room] === socket.id) {
      socket.to(room).emit("startPath", data);
    } else if (proom && drawingAcess[proom] === socket.id) {
      socket.to(proom).emit("startPath", data);
    }
  });


  socket.on("draw", (data) => {
    const room = playerRooms[socket.id];
    const proom = privatePlayerRoom[socket.id];

    if (room && drawingAcess[room] === socket.id) {
      socket.to(room).emit("draw", data);
    } else if (proom && drawingAcess[proom] === socket.id) {
      socket.to(proom).emit("draw", data);
    }
  });

  socket.on("endPath", () => {
    const room = playerRooms[socket.id];
    const proom = privatePlayerRoom[socket.id];

    if (room && drawingAcess[room] === socket.id) {
      socket.to(room).emit("endPath");
    } else if (proom && drawingAcess[proom] === socket.id) {
      socket.to(proom).emit("endPath");
    }
  });

  socket.on("clearCanvas", () => {
    const room = playerRooms[socket.id];
    const proom = privatePlayerRoom[socket.id];

    if (room && drawingAcess[room] === socket.id) {
      socket.to(room).emit("clearCanvas");
    } else if (proom && drawingAcess[proom] === socket.id) {
      socket.to(proom).emit("clearCanvas");
    }
  });

  socket.on('word',(({word})=>{
    const room = playerRooms[socket.id];
    const proom = privatePlayerRoom[socket.id];
   if(room){
    currentWords[room]=word.toLowerCase();
     io.to(room).emit('word',{word});
   }else if(proom){
    currentWords[proom]=word.toLowerCase();
    io.to(proom).emit('word',{word});
   }
  }));

  console.log("User connected with id:", socket.id);

  socket.on("privateCreate", (data) => {
    const privateId = `room-${data.hints}`;
    const privateRoomId = Object.keys(privateRooms);
    for (let privateroom of privateRoomId) {
      if (privateroom === privateId) {
        if (privateRooms[privateroom].length !== 0) {
          socket.emit("message", { message: "Used" });
          return;
        }
      }
    }
    privateRooms[privateId] = [];
    privateRoomSize[privateId] = data.players;
    socket.emit("message", { message: "Created" });
  });


  socket.on("joinPrivate", (data) => {
    const roomIds = data.roomId;
    const name = data.name;
    const privateId = `room-${roomIds}`;
    let found = false;
    const privateRoomId = Object.keys(privateRooms);
    for (let privateroom of privateRoomId) {
      if (privateroom === privateId) {
        found = true;
      }
    }
    if (found === false) {
      socket.emit("NoRoomFound", { message: "NoRoomFound" });
    } else {
      if (privatePlayerRoom[socket.id] === privateId) {
        const index = privateRooms[privateId].findIndex(
          (player) => player.id === socket.id
        );
        if (index !== -1) {
          const player = privateRooms[privateId][index];
          privateRooms[privateId].splice(index, 1);
          io.to(privateId).emit("message", {
            sender: "System",
            text: `${player.name} has changed name to ${name}!`,
          });
          privateRooms[privateId].push({
            id: socket.id,
            name,
            points: player.points,
          });
        }
        io.to(privateId).emit("playerList", privateRooms[privateId]);
        if(privateRooms[privateId].length === privateRoomSize[privateId] && !drawingAcess[privateId] ){
          startGame(privateId);
         }
      } else if (privateRooms[privateId].length >= privateRoomSize[privateId]) {
        socket.emit("RoomFull", { sender: "System", text: "RoomFull" });
        console.log("Room Full");
        return;
      } else {
        socket.join(privateId);
        privatePlayerRoom[socket.id] = privateId;
        io.to(privateId).emit("message", {
          sender: "System",
          text: `${name} joined the room!`,
        });
        privateRooms[privateId].push({ id: socket.id, name: name, points: 0 });
        console.log(privateRooms[privateId]);
        console.log(`${name} joined room ${privateId}`);
        io.to(privateId).emit("playerList", privateRooms[privateId]);

        if(privateRooms[privateId].length === privateRoomSize[privateId] && !drawingAcess[privateId] ){
          startGame(privateId);
         }
      }

      socket.on("messagePrivate", (message) => {
        const privateId = privatePlayerRoom[socket.id];
        const name = privateRooms[privateId].find(player => player.id === socket.id)?.name;
        if(message.toLowerCase() === currentWords[privateId]){
          const timeLeft = roomTimers[privateId];
        const points = calculatePoints(timeLeft);
        io.to(privateId).emit("message",{sender: "System",text: `${name} guessed the word correctly!`});
        io.to(privateId).emit('correctGuess',{playerId : socket.id});
        const playerIndex = privateRooms[privateId].findIndex(player => player.id === socket.id);
        if(playerIndex !== -1){
          privateRooms[privateId][playerIndex].points += points;
          correctGuessesPerRound[privateId]++;
          io.to(privateId).emit('playerList',privateRooms[privateId]);
        }  
      }else{
        console.log(`Message from ${name} in room ${privateId}:`, message);
        io.to(privateId).emit("message", { sender: name, text: message });
        }
      });

      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id} from room ${privateId}`);
        if (privateRooms[privateId]) {
          const playerIndex = privateRooms[privateId].findIndex(
            (player) => player.id === socket.id
          );
          if (playerIndex !== -1) {
            const player = privateRooms[privateId][playerIndex];
            privateRooms[privateId].splice(playerIndex, 1);
            io.to(privateId).emit("playerList", privateRooms[privateId]);
            io.to(privateId).emit("message", {
              sender: "System",
              text: `${player.name} left the room`,
            });
            console.log(`${player.name} left room ${privateId}`);
            console.log(`Room ${privateId} players:`, privateRooms[privateId]);
            if (privateRooms[privateId].length === 0) {
              delete drawingAcess[privateId];
              delete privateRooms[privateId];
              console.log(`Room ${privateId} deleted`);
            }else if(drawingAcess[privateId] === socket.id){
              selectRadnomPrivateDrawer(privateId);
            }
          }
        }
        delete playerRooms[socket.id];
      });
    }
  });

  socket.on("join", ({ name }) => {
    let userRoom;
    if (playerRooms[socket.id]) {
      userRoom = playerRooms[socket.id];
      const index = rooms[userRoom].findIndex(
        (player) => player.id === socket.id
      );
      if (index !== -1) {
        const player = rooms[userRoom][index];
        rooms[userRoom].splice(index, 1);
        io.to(userRoom).emit("message", {
          sender: "System",
          text: `${player.name} has changed name to ${name}!`,
        });
        rooms[userRoom].push({ id: socket.id, name, points: player.points });
      }
    } else {
      userRoom = getRoom();
      socket.join(userRoom);
      playerRooms[socket.id] = userRoom;
      io.to(userRoom).emit("message", {
        sender: "System",
        text: `${name} joined the room!`,
      });
      rooms[userRoom].push({ id: socket.id, name, points: 0 });
      console.log(`${name} joined room ${userRoom}`);
    }
    console.log(`Room ${userRoom} has players:`, rooms[userRoom]);

    io.to(userRoom).emit("playerList", rooms[userRoom]);

    if(rooms[userRoom].length === ROOM_SIZE && !drawingAcess[userRoom] ){
      startGame(userRoom);
    }

    socket.on("message", (message) => {
      const room = playerRooms[socket.id];
      const name = rooms[room].find(player => player.id === socket.id)?.name;

      if(message.toLowerCase() === currentWords[room]){
        const timeLeft = roomTimers[room];
        const points = calculatePoints(timeLeft);

        io.to(room).emit("message",{sender: "System",text: `${name} guessed the word correctly!`});
        io.to(room).emit('correctGuess',{playerId : socket.id});
        const playerIndex = rooms[room].findIndex(player => player.id === socket.id);

        if(playerIndex !== -1){
          rooms[room][playerIndex].points += points;
          correctGuessesPerRound[room]++;
          io.to(room).emit('playerList',rooms[room]);

          // if(allUsersGuessed(room)){
          //   clearInterval(roomTimers[room]);
          //   endRound(room);
          // }
        }
      }else{
          console.log(`Message from ${name} in room ${userRoom}:`, message);
          io.to(userRoom).emit("message", { sender: name, text: message });
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id} from room ${userRoom}`);
      if (rooms[userRoom]) {
        const playerIndex = rooms[userRoom].findIndex(
          (player) => player.id === socket.id
        );
        if (playerIndex !== -1) {
          const player = rooms[userRoom][playerIndex];
          rooms[userRoom].splice(playerIndex, 1);
          io.to(userRoom).emit("playerList", rooms[userRoom]);
          io.to(userRoom).emit("message", {
            sender: "System",
            text: `${player.name} left the room`,
          });
          console.log(`${player.name} left room ${userRoom}`);
          console.log(`Room ${userRoom} players:`, rooms[userRoom]);
          if (rooms[userRoom].length === 0) {
            delete rooms[userRoom];
            delete drawingAcess[userRoom];
            console.log(`Room ${userRoom} deleted`);
          }else if(drawingAcess[userRoom] === socket.id){
            selectRadnomDrawer(userRoom);
          }
        }
      }
      delete playerRooms[socket.id];
    });
  });
});

server.listen(5000, () => {
  console.log("Listening on port 5000");
});
