import jwt from 'jsonwebtoken'
import User from './UserModel.js'

export const protectRoutes = async(req,res,next)=>{

    try{
     const token = req.headers.token;
     console.log("token",token);
     
     const decode = jwt.verify(token,"JWTToken#0rewrwrwrq")
     console.log(decode);
     
     const user = await User.findById(decode.id).select('-password')
     console.log("user",user);
     
     if (!user){
        return res.status(401).json({mess:'invalid user'})
     }
     req.user = user
     next()
    }
    catch(err){
        console.log(err);
        return res.status(401).json({mess:err})
    }

}