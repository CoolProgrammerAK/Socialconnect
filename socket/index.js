const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];
const adduser = (userid, socketid) => {
  !users.some((user) => user.userid === userid) &&
    users.push({ userid, socketid });
};
const removeuser = (socketid) => {
  users = users.filter((user) => user.socketid !== socketid);
};

const getuser=(userid)=>{
  return users.find((user)=>user.userid==userid)
}

io.on("connection", (socket) => {
  console.log("user connect");
 
  socket.on("addUser", (userid) => {
    adduser(userid, socket.id);
    io.emit("getUsers", users);
  });

  socket.on('sendMessage',({senderId,receiverId,text})=>{
     const user=getuser(receiverId)
     io.to(user?.socketid).emit('getmessage',{
        senderId,text
     })
  })
  socket.on('sendLikeComment',({senderId,receiverId,postId,type})=>{
    const user=getuser(receiverId)
    io.to(user?.socketid).emit('sendLikeComment',{
       senderId,postId,type
    })
 })
 socket.on('removeLikeComment',({senderId,receiverId,postId,type})=>{
  const user=getuser(receiverId)
  io.to(user?.socketid).emit('removeLikeComment',{
     senderId,type,postId
  })
})
socket.on('follow',({senderId,receiverId})=>{
  const user=getuser(receiverId)
  io.to(user?.socketid).emit('follow',{
     senderId
  })
})
socket.on('removefollow',({senderId,receiverId,type})=>{
const user=getuser(receiverId)
io.to(user?.socketid).emit('removefollow',{
   senderId,type
})
})
   socket.on('conversationUpdate',id=>{
    const user=getuser(id)
    io.to(user?.socketid).emit('getconversation',{
       msg:'fetch'
    })
   })
   socket.on("typing", () => {
    socket.broadcast.emit("typing", `Typing...`);
  });

  socket.on("stopped_typing", () => {
   
    socket.broadcast.emit("stopped_typing");
  });
 

  socket.on("disconnect", () => {
    removeuser(socket.id);

    io.emit("getUsers", users);
  });
});
