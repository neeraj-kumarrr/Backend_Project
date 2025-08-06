// import jwt from "jsonwebtoken"
// import { EventEmitterAsyncResource } from "nodemailer/lib/ses-transport/index.js";
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/apiErrorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()
 
//get userid from fucntion
//get user
//access to user. this.id
//return access token and refreshToken;





async function getAccessAndRefreshToken(userid){
const user = await User.findOne({_id:userid})
console.log("user........," , user._id );

if(!user){
    throw new ApiError(400 , "error")
    
}

const accessToken = user.generateAccessToken()
const refreshToken = user.generateRefreshToken()

user.refreshToken = refreshToken;
await user.save({validateBeforeSave: false})
// console.log("refres" , accessToken);
return {accessToken , refreshToken}

}

export {getAccessAndRefreshToken};


export const protect = asyncHandler(async(req , res , next)=>{
    console.log("hittt protect mdd");
    

    //get token from header
    // verify token
    //get req.user
    try {
        const token =  req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer " , "")
        console.log("c  vc ........" , token);

        // const envVariable = process.env.ACCESS_TOKEN_SECRET
        // console.log(envVariable , "enviromnmenr varibaler");
        
    
        const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)
        console.log("nitttt");
        
        console.log("encvvvv" , process.env.ACCESS_TOKEN_SECRET);
        
        console.log("fc  vfv v........." , decodedToken._id);
    
        const user = await User.findOne({_id:decodedToken._id})
        console.log("decodedd idddd" , user);
        if(!user){
            throw new ApiError(404 , "user not found")
        }
        
        req.user = user
        console.log("REQUSER......" , req.user);
        // console.log("USER.............." , user);
    
        next()
    } catch (error) {
        throw new ApiError(400 , "invalid access token");
            
    }
    


} )

