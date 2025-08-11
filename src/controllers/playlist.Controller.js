import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/apiErrorHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploaderCloudinary } from "../utils/cloudinary.js";



export const createPlaylist = asyncHandler(async (req , res)=>{
    // get data from frontend: name , description
    // get  owner from req.user and video from video model
    // then create playlist schema 
    // create logic for selected videos
    const {name , description } = req.body

    if(! name || !description){
        throw new ApiError(401 , "fill name and description for playlist")
        
    }

    // const videos = req.files

    // console.log("videoosss" , videos);
    

    // const videoPaths = req.files.forEach(element => {
    // element.path})

    // const videopath= req.files

    // const newpath =videopath.videos[0].path
    // const secondpath =videopath.videos[1].path
    // const thirdpath =videopath.videos[2].path

    // console.log("videopathsss" , newpath);
    // console.log("videopathsss" , secondpath);
    // console.log("videopathsss" , thirdpath);

    

    // // console.log("reqvideo" , videoPath);

    // const video = await uploaderCloudinary(newpath);
    // const secondVideo = await uploaderCloudinary(secondpath);
    // const thirdVideo = await uploaderCloudinary(thirdpath);


    // console.log("videooeo" , video);

    // const newVideo = new Video({
    //     video : video.url
    // })

    // console.log("new video" , newVideo);
    
    const videoIds = []

    console.log("requested body" , req.body.videos);
    

    const reqVideo = Array.isArray(req.body.videos)



    console.log("requestedVideo" , reqVideo);
    

    if(reqVideo){
        for ( const reqVideos of req.body.videos){

            videoIds.push(reqVideos)
        }
    } else if( typeof req.body.videos === "string" ){

        videoIds.push(req.body.videos)
    }

    console.log("videoids" , videoIds);
    
    if (req.files && req.files.videos && req.files.videos.length > 0){

        for (const files of req.files.videos){

            const cloudRes = await uploaderCloudinary(files.path)

            const newVideoDocs = new Video({
                video : cloudRes.url
            })

            await newVideoDocs.save({validateBeforeSave: false})

            videoIds.push(newVideoDocs._id)


        }

    }


    const newPlaylist = await Playlist.create({
        name : name,
        description: description,
        videos : videoIds,
        owner: req.user._id
    })

    return res.status(201).json( new ApiResponse( 201 , "playlist created successfully" , {newPlaylist}))

})


export const getUserPlaylist = asyncHandler (async (req , res) =>{

    const {userId} = req.params;

    const getPlaylist = await Playlist.find({owner : userId}).populate("videos" , "video")

    console.log("playlist" , getPlaylist);
    

    return res.status(200).json(new ApiResponse(200 , "playlist fetched successfully" , {getPlaylist}))


}) 

export const getPlaylistById = asyncHandler (async (req ,res)=>{

    const {playlistId} = req.params;

    const specificPlaylist = await Playlist.findById(playlistId).populate("videos" , "video")

    return res.status(200).json({specificPlaylist})

})

export const addVideoToPlayList = asyncHandler (async ( req , res)=>{
    const {playlistId , videoId} = req.params

    if (!playlistId || !videoId){
        throw new ApiError(404 , " videoId and playlistId not found")
    }

    const addeddPlaylist = await Playlist.findByIdAndUpdate(playlistId , {
        $push : {
            videos : videoId 
        }
    } ,{$position : 0} , {new : true})

    return res.status(200)
    .json( new ApiResponse(200 , "video addedd to specific playlist ", {addeddPlaylist}))
    // console.log("playlsit " , findPlaylist);
    
    
})

export const removeVideoFromPlayist = asyncHandler( async (req , res)=>{

    const {playlistId , videoId} = req.params;

    const removedVideos = await Playlist.findByIdAndUpdate( playlistId , {
        $pull : {
            videos : videoId
        }
    } , {new : true})

    console.log("removed video" , removedVideos);

    return res.status(201)
    .json( new ApiResponse ( 201 , "video removed successfully" , {removedVideos}))

})

export const deletePlaylist = asyncHandler (async (req ,res)=>{
    const {playlistId} = req.params

    const removedPlaylist = await Playlist.findByIdAndDelete(playlistId)

    return res.status(204).json( new ApiResponse( 204 , "playlist deleted successfully" , {}))
    

})


export const updatePlaylist = asyncHandler(async (req ,res)=>{

    console.log("hit update playlist");
    

    // const {playlistId} = req.params;
    // const playlistId = req.params.playlistId;
    const {playlistId} = req.params

    console.log("playlistid" , playlistId);
    

    const {name , description} =req.body;

    const updatedPlaylist = await Playlist.findByIdAndUpdate(playlistId ,{

        $set:{
            name: name,
            description: description
        }
    } , {new : true})

    return res.status(200).json( new ApiResponse(200 , "playlist update successfully" , {updatedPlaylist}))

})




