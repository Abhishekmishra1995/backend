import express from 'express'
import User from './UserModel.js'
import Message from './MessageModel.js'
import { protectRoutes } from './auth.js'
import cloudarny from './cloudarny.js'
import { io,socketMapUser } from './server.js'

const route = express.Router()

route.get('/user/getUserForSideBar',protectRoutes,async(req,res)=>{

    try{
        const userId = req.user._id
        console.log("user id ",userId);
        
        const filteredUser = await User.find({_id:{$ne:userId}}).select('-password')
        console.log("filteredUser",filteredUser);
        
        const unseenMess = {}
        const promises = filteredUser.map(async(user)=>{
            const message = await Message.find({senderID:user._id,receiverID:userId,seen:false})
            if (message.length > 0 ){
                unseenMess[user._id] = message.length
            }
        })
        await Promise.all([promises])
        return res.status(200).json({mess:'success',users:filteredUser,unseenMess})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({mess:err,users:[]})
    }
})

 route.get('/:id/getAllMessageForSelectedUser',protectRoutes, async(req,res)=>{

    try{
     const {id:selectedId} = req.params
     const myUserID = req.user._id
     const allMessage = await Message.find({$or:[
       {senderID:selectedId,receiverID:myUserID},
       {senderID:myUserID,receiverID:selectedId},
     ]})
   
    await Message.updateMany({senderID:selectedId,receiverID:myUserID},{seen:true})

    // Group messages by date (YYYY-MM-DD)
    const grouped = allMessage.reduce((acc, msg) => {
      const date = new Date(msg.createdAt).toISOString().split("T")[0]; // "2025-10-23"
      if (!acc[date]) acc[date] = [];
      acc[date].push(msg);
      return acc;
    }, {});

    return res.status(200).json({mess:'All Message',message:grouped})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({mess:err,message:[]})
    }
})

route.put('/:id/markMessAsSeen',protectRoutes,async(req,res)=>{
    try{
      const {id} = req.params
      await Message.findByIdAndUpdate(id,{seen:true})
      return res.status(200).json({mess:'success'})
    }
    catch(err){
        return res.status(500).json({mess:err})
    }
})

route.post('/sendMessage',protectRoutes,async(req,res)=>{

    try{
    const {receiverID,text,image} = req.body
    const senderID = req.user._id
    console.log("sender id ",senderID);
    
     
    let imageUrl ;
    if (image){
     const uploadResponse = await cloudarny.uploader.upload(image)
     imageUrl = uploadResponse.secure_url;
    }
    const newMess = await Message({senderID,receiverID,text,image:imageUrl})
    await newMess.save()
    const receiverSocketId = socketMapUser[receiverID]
    console.log("send message to rec",receiverSocketId);

               const messagesArray = Array.isArray(newMess) ? newMess : [newMess];


    const grouped = messagesArray.reduce((acc, msg) => {
      const date = new Date(msg.createdAt).toISOString().split("T")[0]; // "2025-10-23"
      if (!acc[date]) acc[date] = [];
      acc[date].push(msg);
      return acc;
    }, {});

    if (receiverSocketId){
        io.to(receiverSocketId).emit('newMessage',grouped)
            console.log("send message to newMess",grouped);

    }
    return res.status(200).json({mess:'Message sent',message:grouped})
    }
    catch(err){
     return res.status(500).json({mess:err})
    }
})

export default  route