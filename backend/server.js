const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');

const server = http.createServer(app);
app.use(cors());

const { Server } = require("socket.io");

const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

const ROOM_SIZE = 3;
const rooms = {};
const playerRooms = {};

const getRoom = () => {
    const roomIds = Object.keys(rooms);
    for (let room of roomIds) {
        if (rooms[room].length < ROOM_SIZE) return room;
    }
    const newRoom = `room-${roomIds.length + 1}`;
    rooms[newRoom] = [];
    return newRoom;
};

io.on('connection', (socket) => {
    console.log('User connected with id:', socket.id);
    let userRoom;
    socket.on('join', ({ name }) => {
        if (playerRooms[socket.id]) {
             userRoom = playerRooms[socket.id];
            const index =  rooms[userRoom].findIndex(player => player.id === socket.id);
            if(index !== -1){
                const player = rooms[userRoom][index];
                rooms[userRoom].splice(index, 1);
                io.to(userRoom).emit('message', { sender: 'System', text: `${player.name} has changed name to ${name}!` });
                rooms[userRoom].push({ id: socket.id, name, points: player.points});
            }
        }else{
        userRoom = getRoom();
        socket.join(userRoom);
        playerRooms[socket.id] = userRoom;
        io.to(userRoom).emit('message', { sender: 'System', text: `${name} joined the room!` });
        rooms[userRoom].push({ id: socket.id, name, points: 0 });
        console.log(`${name} joined room ${userRoom}`);
        }
        console.log(`Room ${userRoom} has players:`, rooms[userRoom]);

        io.to(userRoom).emit('playerList', rooms[userRoom]);

        socket.on('message', (message) => {
            console.log(`Message from ${name} in room ${userRoom}:`, message);
            io.to(userRoom).emit('message', { sender: name, text: message });
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id} from room ${userRoom}`);
            if (rooms[userRoom]) {
                const playerIndex = rooms[userRoom].findIndex(player => player.id === socket.id);
                if (playerIndex !== -1) {
                    const player = rooms[userRoom][playerIndex];
                    rooms[userRoom].splice(playerIndex, 1);
                    io.to(userRoom).emit('playerList', rooms[userRoom]);
                    io.to(userRoom).emit('message', { sender: 'System', text: `${player.name} left the room` });
                    console.log(`${player.name} left room ${userRoom}`);
                    console.log(`Room ${userRoom} players:`, rooms[userRoom]);
                    if (rooms[userRoom].length === 0) {
                        delete rooms[userRoom];
                        console.log(`Room ${userRoom} deleted`);
                    }
                }
            }
            delete playerRooms[socket.id];
        });
    });
});

server.listen(5000, () => {
    console.log('Listening on port 5000');
});