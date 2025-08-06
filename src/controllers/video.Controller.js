// crud for videos

// import {Video} from "..models/video.models.js"
import { Video } from "../models/video.model.js";
import { options, User } from "../models/user.model.js";
// import { protect } from "../middlewares/auth.middleware.js";
import mongoose ,{isValidObjectId} from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiErrorHandler.js";
import { uploaderCloudinary } from "../utils/cloudinary.js";
import { checkServerIdentity } from "tls";
import { log } from "console";
// import { title } from "process";
// import { match } from "assert";

export const getAllVideos = asyncHandler(async (req , res)=>{

    console.log("hit getall videooss");

    
        const { query, sortBy, sortType, userId ,page , limit } = req.query;

        // if(! query || !sortBy || !sort)
        console.log("queries" , query);
        console.log("queries" , sortBy);
        console.log("queries" , sortType);
        console.log("queries" , userId);
        // console.log("queries" , query);

        
    
//         // const video = await Video.findOne().lean()
    
//         // console.log("videooo" , video);
//         const filters = {}
    
//         filters.$or =  [
//             {
//                 title:{ $regex : query , $options : "i"}
//             } ,
//             {
//                 description :{ $regex : query , $options :"i"}
//             }
//         ]

//         // console.log("filters" , filters);
    
    
//         if (userId) {
//             filters.owner = userId
//         }
    
//         console.log("filters" , filters);
        
//         // console.log("filterrrr" , filters);
        
        
        
//         const sortOptions = {}
        
//    

//         console.log("filters" , sortOptions);


//         const totalVideos = await Video.countDocuments(filters) 

//         console.log("totalvideoisss ", totalVideos);
        
        
//         let page = parseInt(req.query.page) || 1
//         let limit = parseInt(req.query.limit) || 10
//         let skip = (page - 1) * limit 
//         let totalPages = Math.ceil(totalVideos / limit)
        
//         const getNewVideo = await Video.find(filters).sort(sortOptions).skip(skip).limit(limit)

//         console.log("getnewww" , getNewVideo);

//         const videosViews = Video.findByIdAndupdate(getNewVideo._id , {
//             $inc :{
//                 views : 1
//             },
            
//         },{
//             new :true
//         })
        
    
//         return res.status(200)
//         .json(new ApiResponse(200 , "fetched filterd videos" , {data : getNewVideo , totalPages , videosViews}))

// } catch (error) {
//     throw new ApiError(401 , "some data is wrong or invalid or missing")
// }

//let try with aggregation pipeline use mongodb


// const videos = Video.aggregate([{

//     $match :{
//         query : query
//     }

// },{
//     $lookup:{
//         from:""
//     }
// },{

// }])

// })

// lookup from the video table amnd set the thw value inside the name of the ibject and having difiiculties in it and havi


const matchfield = {
        $or :[
            {
               title:{ $regex : query , $options:"i"}
            },
            {
                description:{$regex : query , $options: "i"}
            }
        ] ,

        

        if(userId){
            matchfield.owner = userId
            }
    }



console.log("matchfielddd" , matchfield);

const pipeline = [
    {$match : matchfield},

    {
        $lookup : {
            from : "users",
            localField : "owner",
            foreignField: "_id",
            as: "user"
        }
    },

    {
        $unwind : "$user"
    },

    {$sort : {
        [sortBy] : sortType === "desc" ? -1 : 1
    }}
]


console.log("pipeline" , pipeline);

const options = {
    page ,
    limit
}

const result = await Video.aggregatePaginate(Video.aggregate(pipeline) , options)

console.log(result, "videeoooo");

return res.status(201)
.json(new ApiResponse(201 , "video fetched successfully" , {result}))


})
    
//GET ALL VIDEOS
//FETCH DATABASE FOR USER
// const video = await User.findById(req.user?.id).populate("watchHistory" , "_id title")
// console.log("videooo" , video[0].title);


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


export const getVideoById = asyncHandler(async (req ,res) =>{

    console.log("hit get videoby id");
    

    const {videoId} = req.params;

    const videoViews = await Video.findByIdAndUpdate(videoId  , {
        $inc :{views : 1}
    } , {new : true}
)

    return res.status(200)
    .json( new ApiResponse (200 , "video and views fetched successfully" , {videoViews}))
})

export const updateVideo = asyncHandler( async (req ,res)=>{

    console.log("hit update videooo");
    

    // get  data that need to update  from req.body 
    // find by id and update for that data
    // title and description from req.body
    // thumbnail from req.files cloudinary
    // give response back!!
    const {videoId} = req.params

    console.log("video id" , videoId);
    
    
    const {title , description} = req.body

    console.log(" title and description" , title , description);
    

    const thumbnailPath = req.file.path

    // console.log(thumbnail , "requested file");

    const thumbnail = await uploaderCloudinary( thumbnailPath );

    console.log("thumbnail url " , thumbnail);
    


    

    const result = await Video.findByIdAndUpdate(videoId , { $set : {
        title : title ,
        description : description,
        thumbnail: thumbnail.url
    }},{ new : true})


    return res.status(201)
    .json( new ApiResponse(201 , "video updated successfully " , {result}))

})


export const deleteVideo = asyncHandler( async ( req , res) =>{

    // find video by id 
    // delete video by id

    const {videoId} = req.params

    const deletedVideo = await Video.findByIdAndDelete( videoId ) 

    return res.status(200)
    .json( new ApiResponse( 200 , "video deleted successfully" , {}))

})


export const togglePublishStatus = asyncHandler(async (req ,res)=>{

    console.log("status toggle hitted");
    // const {isPublished} = req.body;
    const {videoId} = req.params

    const currentVideo = await Video.findById(videoId)

    if(!currentVideo){
        throw new ApiError(404 , " video not found")
    }


    // videoid by params 
    // updte status of toggle by true or false 

    console.log("req id" , videoId)   ;
    

    const toggleUpdate = await Video.findByIdAndUpdate( videoId , {
        $set : {isPublished : !currentVideo.isPublished}
    } , {new : true})

    console.log("toggle update" , toggleUpdate);
    

    return res.status(201)
    .json( new ApiResponse( 201 , "toggle update successfully" , {toggleUpdate}))


})

