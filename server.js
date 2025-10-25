
import express from 'express'
import http from 'http'
import cors from 'cors'
import dotenv from 'dotenv'
import {connectDB} from './DB.js'
import authRouter from './userRoute.js'
import MessRouter from './messageRoute.js'
import {Server} from 'socket.io'

dotenv.config()
const app = express()
const servere = http.createServer(app)
export const io = new Server(servere,{
   cors: {
    origin: "*", // replace * with frontend URL in production
    methods: ["GET", "POST"]
  },
})

app.use(express.json())
app.use(cors())
export const socketMapUser = {}

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  // optional: handle custom userId query
  const userId = socket.handshake.query.userId;
  console.log("User ID:", userId);

  if (userId) socketMapUser[userId] = socket.id
  
  io.emit('getOnlineUser',Object.keys(socketMapUser))
  console.log('online user',Object.keys(socketMapUser));
  

  socket.on("sendMessage", (data) => {
    console.log("Message received:", data);
    io.emit("receiveMessage", data); // broadcast to everyone
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", userId);
    delete socketMapUser[userId]
      io.emit('getOnlineUser',Object.keys(socketMapUser))
  });
});



// io.on('connection',(socket)=>{

//     const userID = socket.handshake.query.userId
//     console.log('user connected',userID);
//     if (userID){
//     socketMapUser[userID] = socket.id
//     }
//     io.emit('getonlineusers',Object.keys(socketMapUser))

//     socket.on('disconnect',()=>{
//         console.log('user disconnect',userID);
//         delete socketMapUser[userID]
//         io.emit('getonlineusers',Object.keys(socketMapUser))
//     })

    
// })

app.use('/api/auth',authRouter)
app.use('/api/message',MessRouter)

await connectDB()


export default app;

