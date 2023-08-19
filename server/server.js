const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const ACTIONS = require('../src/constants/Actions');


const server = http.createServer(app);
const io = new Server(server);




const userSocketMap = {};


function getAllConnectedClients(roomId) {
    // Map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}

io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId: socket.id,
            });
        });
    });

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });
// ChatMessage
socket.on('sendMessage', ({ text, roomId,Username }) => {
        console.log(text); //geting the resppnse
      io.to(roomId).emit('receiveMessage',  text, Username );
      });

//whiteBoard    
socket.on(ACTIONS.OPEN_WHITE_BOARD,({modalOpen,roomId})=>{
    console.log('moda',modalOpen); //getting true
    console.log('room',roomId);//getting id
    io.to(roomId).emit(ACTIONS.WHITE_BOARD_OPENED,{modalOpen:true,roomId});
})

socket.on(ACTIONS.CLOSE_WHITE_BOARD,({modalOpen,roomId})=>{
    io.to(roomId).emit(ACTIONS.WHITE_BOARD_OPENED,{modalOpen:false,roomId});
    console.log('closemoda',modalOpen);//getting undefined
    console.log('closeroom',roomId);//getting undefined
})

socket.on(ACTIONS.WHITE_BOARD_SETTINGS, (data) => {
    const { roomId, pencil, eraser } = data;
    console.log('setting',data); //getting console
    io.to(roomId).emit(ACTIONS.WHITE_BOARD_SETTINGS,{ roomId, pencil, eraser});
  });

  socket.on(ACTIONS.DRAW_START, (data) => {
    const { roomId, x, y } = data;
    console.log('start',data); //getting console
   io.to(roomId).emit(ACTIONS.DRAW_START,{roomId,x,y});
  });
  socket.on(ACTIONS.DRAW_MOVE, (data) => {
    const { roomId, x, y } = data;
    console.log('move',data); //getting console
    io.to(roomId).emit(ACTIONS.DRAW_MOVE,{roomId,x,y});
  });

  socket.on(ACTIONS.DRAW_END, (data) => {
    const { roomId } = data;
    console.log('end',data); //getting console
    io.to(roomId).emit(ACTIONS.DRAW_END,{roomId});
  });
  socket.on(ACTIONS.PEN_COLOR_CHANGE,(data)=>{
    const {roomId, color}=data;
    console.log('color',data);
    io.to(roomId).emit(ACTIONS.PEN_COLOR_CHANGE,{roomId,color});
  })
    socket.on('disconnecting', () => {
    const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    });
});




const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));