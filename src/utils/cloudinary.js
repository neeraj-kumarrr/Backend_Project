import {v2 as cloudinary} from "cloudinary"

import fs from "fs"

import dotenv from "dotenv"

dotenv.config()

// console.log("env files" ,process.env.CLOUDINARY_CLOUD_NAME,
//     process.env.CLOUDINARY_API_KEY,
//     process.env.CLOUDINARY_API_SECRET );


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

// cloudinary.uploader.upload()

export const uploaderCloudinary = async (localFilePath) =>{

    try{
        if(!localFilePath) return null ;

        const res = await cloudinary.uploader.upload(localFilePath , {
            resource_type:"auto"
  
        })

        fs.unlinkSync(localFilePath)
        console.log("local...." , localFilePath);
        
        console.log("file uploaded successfully")
        return res;

    } catch (error){
        // fs.unlinkSync(localFilePath)
        console.error("error............" , error)

    }

}



// const uploadResult = await cloudinary.uploader
//        .upload(
//            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//               public_id: 'shoes',})