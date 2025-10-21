
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
    cors:{origin:'*'}
})

export const socketMapUser = {}
io.on('connection',(socket)=>{

    const userID = socket.handshake.query.userId
    console.log('user connected',userID);
    if (userID){
    socketMapUser[userID] = socket.id
    }
    io.emit('getonlineusers',Object.keys(socketMapUser))

    socket.on('disconnect',()=>{
        console.log('user disconnect',userID);
        delete socketMapUser[userID]
        io.emit('getonlineusers',Object.keys(socketMapUser))
    })

    
})
app.use(express.json())
app.use(cors())

app.use('/api/auth',authRouter)
app.use('/api/message',MessRouter)

await connectDB()
servere.listen(process.env.PORT,()=>{
   
    console.log('server is start',process.env.PORT);
})




