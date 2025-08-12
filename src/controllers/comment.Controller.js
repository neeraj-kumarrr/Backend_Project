import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js";
import mongoose , {Schema} from "mongoose"
import { ApiError } from "../utils/apiErrorHandler.js";
// import {aggregatePaginate}





export const addComment = asyncHandler(async (req ,res)=>{

    console.log("hit add comment");
    

    const {videoId} = req.params;

    const {content} = req.body;

    const addingComment = await Comment.create({

        content : content,
        video : videoId,
        owner : req.user._id

    })

    return res.status(201).json( new ApiResponse(201 , "comment added successfully" , {addingComment}))

})


export const getVideoComment = asyncHandler(async (req ,res)=>{

    console.log("hitt get video comment");
    

    const {videoId } = req.params;

    if(! mongoose.Types.ObjectId(videoId)){
        throw new ApiError(404 , "comment not found")
    }

    const { page , limit} = req.query;


    // const skip = (page -1) * limit

    // const ress = await Comment.find({ video : videoId}).skip(skip).limit(limit)

    // console.log("responseee" , ress);
    


    console.log("page and limit" , page  , limit);


    const pipeline = [
        {$match : {
            video :  new mongoose.Types.ObjectId(videoId)
        }} ,
        {
            $sort : { createdAt : -1}
        }
    ]

    console.log(pipeline , "pipelinennne");
    

    // const {}

    const options = {
        page : parseInt(page) ,
        limit: parseInt(limit)
    }

    console.log("options" , options);
    

    // const allComments = await Comment.find()
    const result = await Comment.aggregatePaginate(Comment.aggregate(pipeline) , options)
    
    console.log("result " ,result );
    

    return res.status(200).json( new ApiResponse(200 , "all comment fetched successfully " , {result}))


})


export const updateComment = asyncHandler(async (req ,res)=>{
    const {commentId} = req.params
    if(! new  mongoose.Types.ObjectId(commentId)){
        throw new ApiError(404 , "comment not found")
    }

    const {content} = req.body

    const updatedComment = await Comment.findByIdAndUpdate( commentId , {
        $set : { content : content}
    } , {new : true})

    return res.status(201).json( new ApiResponse(200 , "comment updated susscessfully" , {updatedComment}))



})

export const deleteComment = asyncHandler(async (req ,res)=>{

    const {commentId} = req.params

    if(! new mongoose.Types.ObjectId(commentId)){
        throw new ApiError(404 , "comment not found")
    }

    await Comment.findByIdAndDelete(commentId)

    return res.status(204).json( new ApiResponse(204 , "comment deleted successfully" , {}))

})

