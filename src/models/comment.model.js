import mongoose , {Schema} from "mongoose"

import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const commentSchema = new Schema({
    video:{
        type:Schema.Types.ObjectId,
        ref:"Video"
    },
    owner:{
        types:Schema.Types.ObjectId,
        ref:"User"
    },
    content:{
        type: String,
        required:true
    }



} ,{timestamps:true})

mongoose.plugin(mongooseAggregatePaginate)

export const Comment = mongoose.model("Comment" , commentSchema)