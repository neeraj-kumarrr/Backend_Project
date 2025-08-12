

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiErrorHandler.js";
import { Like } from "../models/like.model.js";

// export const toggleVideoLike = asyncHandler(async (req ,res))
export const toggleVideoLike = asyncHandler( async function(req ,res){

    console.log("hit toggle video like");
    
        const {videoId} = req.params;

        const likedById=req.user._id

        if(!likedById){
        throw new ApiError( 401 , "liked id not be null")
    }

        console.log("liked id " , likedById);
        

        const existingLike = await Like.findOne({video : videoId , likedBy : likedById});

        console.log("existing likee" , existingLike);
        

        if(existingLike){
            await Like.findByIdAndDelete(existingLike._id)

            return res.status(200).json( new ApiResponse( 200 , "video unliked "  , {}))
        }
         else {
            const likedVideo = await Like.create({video : videoId , likedBy : likedById})

            return res.status(201).json( new ApiResponse(201 , "video liked" , {likedVideo}))
         }

})


export const CommentLikeToggle = asyncHandler (async(req ,res)=>{
    const {commentId} = req.params;

    const likedById = req.user._id

    if(!likedById){
        throw new ApiError( 401 , "liked id not be null")
    }

    const existingLike = await Like.findOne({comment : commentId , likedBy : likedById})

    if(existingLike){
            await Like.findByIdAndDelete(existingLike._id)

            return res.status(200).json( new ApiResponse( 200 , "comment unliked "  , {}))
        }
         else {
            const likedComment = await Like.create({comment: commentId , likedBy : likedById})

            return res.status(201).json( new ApiResponse(201 , "comment liked" , {likedComment}))
         }


})

export const tweetLikeToggle = asyncHandler (async (req , res)=>{
    const {tweetId} = req.params;

    if(!tweetId){
        throw new ApiError(401 , "tweet id cannot be null")
    }

    const likedById =req.user._id

    if(!likedById){
        throw new ApiError( 401 , "liked id not be null")
    }

    const existingLike = await Like.findOne({tweet : tweetId , likedBy : likedById})

    if(existingLike){
            await Like.findByIdAndDelete(existingLike._id)

            return res.status(200).json( new ApiResponse( 200 , "tweet unliked "  , {}))
        }
         else {
            const likedTweet = await Like.create({tweet: tweetId , likedBy : likedById})

            return res.status(201).json( new ApiResponse(201 , "tweet liked" , {likedTweet}))
         }



})

export const getLikedVideo = asyncHandler (async (req ,res)=>{

    const likedById = req.user._id

    if(!likedById){
        throw new ApiError(404 , "user not found")
    }

    const likedVideo = await Like.find({likedBy : likedById , video : {$ne : null}}).populate("video" , "video")

    if(!likedVideo){
        throw new ApiError (400 , "liked video not found" )
    }

    console.log("likedVideooo" , likedVideo);

    return res.status(200).json( new ApiResponse(200 , "liked video fetched successfully" , {likedVideo}))


})


