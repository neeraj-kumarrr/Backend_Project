import mongoose , {Schema} from "mongoose";

import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    video:{
        type:String,
        required:true,
         // cloudinary url
    },

    thumbnail:{
        type:String, //cloudinary url
        required:true
        },

    title :{
        type:String
    },

    duration:{
        type:String,
         // cloudinary url
    },

    description:{
        type:String,
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

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video" , videoSchema)

