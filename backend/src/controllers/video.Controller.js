// crud for videos

// import {Video} from "..models/video.models.js"
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
// import { protect } from "../middlewares/auth.middleware.js";
import mongoose ,{isValidObjectId} from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiErrorHandler.js";
import { uploaderCloudinary } from "../utils/cloudinary.js";

export const getAllVideos = asyncHandler(async (req , res)=>{

//post video means create video
//show all video by id and send response 


})

export const postAVideo = asyncHandler(async (req , res)=>{
console.log("hit post videoo");

const {title , description  } = req.body



const Path = req.files

console.log("pathhhh" , Path);


const videoPath = Path.video[0].path
const thumbnailPath = Path.thumbnail[0].path;

console.log("videopath" , videoPath);
console.log("thumbnailpath" , thumbnailPath);


if((!videoPath) || (!thumbnailPath)){
    throw new ApiError(400 , "paths are undefined")
}

const video = await uploaderCloudinary(videoPath ,{resource_type:"video"})
const thumbnail = await uploaderCloudinary(thumbnailPath )

// if(! video || thumbnail){
//     throw new ApiError(401 , "video and thumbnail is empty")
// }

const newVideo = await Video.create({
    title,
    description,
    video: video.url,
    thumbnail:thumbnail.url,
    duration:video.duration,
    owner:req.user._id

})

return res.status(201)
.json(new ApiResponse(201 , "file upload and video get" , {newVideo}))

})

