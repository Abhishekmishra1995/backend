import mongoose from "mongoose";
import express from 'express'
import User from './UserModel.js'
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs";

const authRoute = express.Router()

authRoute.post('/register',async(req,res)=>{

    try{
    const {fullName,email,password,bio} = req.body
    if (!fullName || !email || !password || !bio){
       return res.status(401).json({mess:'All Fields are required'})
    }
    console.log(fullName);
    
    const user = await User.findOne({email})
    if (user){
      return res.status(401).json({mess:'Email already registered'})
    }
    const salt = await bcrypt.genSalt(10)
    const hasPass = await bcrypt.hash(password,salt)
    const newUser = new User({fullName,email,password:hasPass,bio})
    console.log(hasPass);
    
    await newUser.save()
    const token = jwt.sign({id:newUser._id},"JWTToken#0rewrwrwrq")
    return res.status(200).json({mess:'Account created successfully',data:newUser,token:token})
 }
 catch(err){
   console.log(err.message);
   
        return res.status(500).json({mess:err,data:{}})
 }
})

authRoute.post('/login',async(req,res)=>{

    try{
    const {email,password} = req.body
    if (!email || !password ){
       return res.status(401).json({mess:'All Fields are required'})
    }
    const user = await User.findOne({email})
    if (!user){
      return res.status(401).json({mess:'Email not exist'})
    }
    const hasPass = await bcrypt.compare(password,user.password)
    if (!hasPass){
       return res.status(401).json({mess:'Password is not exist'})
    }

    const token = jwt.sign({id:newUser._id},"JWTToken#0rewrwrwrq")
    return res.status(200).json({mess:'Login successfully',data:newUser,token:token})
 }
 catch(err){
        return res.status(500).json({mess:err,data:{}})
 }
})

export default  authRoute
