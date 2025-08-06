import { application } from "express";
import { Tweet } from "../models/tweet.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



export const postTweet = asyncHandler(async (req , res) =>{
 // get tweet from frontend body
 // tweet owner comes from req.user.id

    const {content } = req.body;

    console.log( "tweet userrr id ",req.user.fullName);
    

    const tweet = await Tweet.create({ content : content , owner : req.user._id })

    return res.status(201)
    .json(new ApiResponse(201 , "tweet created successfully" , {tweet}))

})


export const getAllTweet = asyncHandler(async (req ,res) => {

    const tweets = await Tweet.find()

    return res.status(200)
    .json( new ApiResponse(200 , " All tweet fetched successfully" , {tweets}))

})

export const updateTweet = asyncHandler(async (req ,res) => {
    const {content} = req.body

    const {tweetId} = req.params;

    const UpdatedTweet = await Tweet.findByIdAndUpdate( tweetId , {
        $set : { content : content} 
    } , {new : true})

    return res.status(201)
    .json( new ApiResponse ( 201 , "tweet updated " , {UpdatedTweet}))

})


export const deleteTweet = asyncHandler( async ( req , res ) => {

    console.log("hit delete tweet");
    

    const {tweetId} = req.params;

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId)

    return res.json( new ApiResponse (201 , " tweet deleted " , {}))



})