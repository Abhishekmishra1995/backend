import mongoose from "mongoose";
const messageShema = mongoose.Schema({
    senderID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'UserModel',
        required:true
    },
    receiverID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'UserModel',
        required:true
    },
    text:{
        type:String,
    },
    image:{
        type:String
    },
    seen:{
type:Boolean,
default:false
    }
},{timestamps:true})

const messageModel = mongoose.model("MessageModel",messageShema)
export default  messageModel

