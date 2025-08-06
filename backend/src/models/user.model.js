import mongoose ,{Schema} from "mongoose"

import jwt from "jsonwebtoken"

import bcrypt from "bcrypt"

// import dotenv from "dotenv"

// dotenv.config()

const userSchema = new Schema({
    username:{
        type:String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true // for more searching it is better to use index
    },
    
    email:{
        type:String,
        required: true,
        unique:true,
        lowercase: true,
        trim: true,
         
    }  ,
                                                                                                            
    fullName:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        index:true
    },

    avatar:{
        type:String, //cloudinary url
    },

    coverimage:{
        type:String // cloudinary url
    },

    watchHistory:{
        type: Schema.Types.ObjectId,
        ref:"Video"
    },

    password:{
        type:String ,
        required:true
    }
    ,
    refreshToken:{
        type:String
    },

    
        isActive:{
            type:Boolean,
            
        }
    
} , {
    timestamps:true
})


userSchema.pre("save" , async function( next){
    if(!this.isModified("password")) return next();
    
    this.password =await bcrypt.hash(this.password , 10)
    next()
    
})

userSchema.methods.isPasswordCorrect = async function (password){
    // console.log("this pas" , this.password);
    return await  bcrypt.compare(password , this.password)
}



userSchema.methods.generateAccessToken = function (){
    return jwt.sign({
        _id: this._id,
        email:this.email,
        username:this.username
    } ,
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
        
        
    )
    
}
// console.log("refresh exp" , process.env.ACCESS_TOKEN_EXPIRY);

userSchema.methods.generateRefreshToken = function()
{ 
    return jwt.sign({
        _id : this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY 
    }
)
}

export const options = {
    httpOnly: true,
    secure:false
}

// export {options}

// export const options = async()=>{
//     return 
// }
export const User = mongoose.model("User" , userSchema);