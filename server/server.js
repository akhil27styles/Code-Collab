const express=require('express');
const app=express();
const http=require('http');
const {Server}=require('socket.io');
const ACTIONS = require('../src/constants/Actions');

const server=http.createServer(app);
const io=new Server(server);

const userSocketMap={};

function getAllConnectedClients(roomId){
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId)=>{
       return {
        socketId,
        username:userSocketMap[socketId],
       };
     }
    );
}
io.on('connection',(socket)=>{
    console.log(`socket connected`,socket.id);

    socket.on(ACTIONS.JOIN,({roomId,username})=>{

      // check to Don't add same username again 
      const existingSocketId = Object.keys(userSocketMap).find(
      (socketId) => userSocketMap[socketId] === username);
      if(existingSocketId){
        return;
       }

     userSocketMap[socket.id]=username;
     socket.join(roomId);
     const clients=getAllConnectedClients(roomId);
     
     clients.forEach(({socketId})=>{
        io.to(socketId).emit(ACTIONS.JOINED,{
            clients,
            username,
            socketId:socket.id,
        });
     });
 });
 
  //code change
  socket.on(ACTIONS.CODE_CHANGE,({roomId,code})=>{
    console.log(code); // i am getting code on console
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE,{code});
  })


  socket.on('disconnecting',()=>{
    const rooms=[...socket.rooms];
    rooms.forEach((roomId)=>{
      socket.in(roomId).emit(ACTIONS.DISCONNECTED,{
        socketId:socket.id,
        username:userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  })
});

const PORT=process.env.PORT || 5000;
server.listen(PORT,()=> console.log(`I am on ${PORT}`));