import mongoose ,{Schema, Types} from "mongoose"


const playlistSchema = new Schema({

    videos:[{
        type:Schema.Types.ObjectId,
        ref:"Video"
    }],

    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },

    name:{
        type:String
    },

    description:{
        type:String
    },






} ,{timestamps:true})



export const Playlist = mongoose.model("Playlist" , playlistSchema)