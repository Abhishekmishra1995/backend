
import {v2 as cloudinary} from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config()


cloudinary.config({
    cloud_name:process.env.CLOUDANRY_NAME,
    api_key:process.env.CLOUDANRY_API_KEY,
    api_secret:process.env.CLOUDANRY_API_SECRET
})

export default cloudinary