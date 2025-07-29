import mongoose , {Schema} from "mongoose";

import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    video:{
        type:string,
        required:true,
         // cloudinary url
    },

    thumbnail:{
        type:string, //cloudinary url
        required:true
        },

    title :{
        type:string
    },

    duration:{
        type:string,
         // cloudinary url
    },

    description:{
        type:string,
        required:true
        },
    
    views:{
        type:Number,
        default:0
    },

    isPublished:{
        type:Boolean,
        default:true
    },

    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }

    
} , {timestamps:true})

mongoose.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video" , videoSchema)

