import mongoose from "mongoose";

const userShema = mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true
    },
     password:{
        type:String,
        unique:true,
        required:true
    },
    fullName:{
        type:String,
        required:true
    },
     bio:{
        type:String,
        required:true
    },
     profilePic:{
        type:String,
        default:""
    }
},{timestamps:true}
)

const User = mongoose.model("UserModel",userShema)
export default User
