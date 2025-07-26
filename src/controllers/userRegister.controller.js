// import userRegisterRoute from ""

import { ApiError } from "../utils/apiErrorHandler.js";
import {User} from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploaderCloudinary } from "../utils/cloudinary.js";
// import { application } from "express";
import { ApiResponse } from "../utils/apiResponse.js";
import { getAccessAndRefreshToken } from "../middlewares/auth.middleware.js";
import { options } from "../models/user.model.js";
import jwt from "jsonwebtoken"
import { Subscription } from "../models/subscription.model.js";
import mongoose  from "mongoose";




export const RegisterUser = asyncHandler( async (req , res) => {
    console.log("HIT REGISTER");
    
    // get data from frontend
    //valiation not empty
    // check user is not existed previous: username or / email
    // check avatar for images
    //if available uplaod them in cloudinary
    //create user object - entry in db
    //remove password and refresh token
    //return res

    const { username , email , password , fullName } = req.body;

    if ([username , email , password , fullName].some((field)=> (!field) ||
        field.trim ===""
        
 
    )){
        throw new ApiError(404 , "provide all fields")
    }

    const existedUser = await User.findOne({
        $or: [{username} , {email}]
    })

    if(existedUser){
        throw new ApiError(400 , "user already Exist")
    }
    // console.log("dffds");
    
console.log("def" , req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverimage[0]?.path
    console.log("ss" , avatarLocalPath , coverImageLocalPath);
    console.log("req.file" , req.files)
    


    if(!avatarLocalPath){
        throw new ApiError( "400" , "avatar is required")
    }

    const avatar = await uploaderCloudinary(avatarLocalPath)
    // console.log("DONE" ,avatar);
    
    const coverimage = await uploaderCloudinary(coverImageLocalPath)
    // console.log("DONE-next " , coverImage);

    if(!avatar){
        throw new ApiError(400 , "avatar is required")
    }

    const user = new User({
        username,
        fullName,
        email,
        password,
        avatar: avatar.url,
        coverimage:coverimage.url,

    })

    await user.save()

    const createdUser = await User.findOne(user._id)?.select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(404 , "user not found" )
    }

    return res.status(201).json(
        new ApiResponse(200 , "user created successfully" , createdUser)
    )
})

export const loginUser = asyncHandler(async (req , res)=>{
    console.log("HITT LOGIN...............");
    console.time("login")
    
// get email and password and username from form or frontend
//math the given password from database pasword && find the user by email if exists check password
// redirct to login page
//check access and refresh token
try {
    const {email , password} = req.body;
    
    
        if (!email){
            throw new ApiError(404 , "username and email is required") 
            
        }
        // console.log("user , email" , username , email);
        
        const user = await User.findOne({
            email
        }
        )
        
        // console.log("USR........." , user);
        
        
        if (!(email)){
            throw new ApiError(400, "user not found")
        }
        // console.log("THIS.........." , user.password);
        
        
        // const isMatch = bcrypt.compare(password , this.password)
        const isMatch = await user.isPasswordCorrect(password)
        console.log("sjncjdc" , isMatch);
        
        if(!isMatch){
            throw new ApiError(404)
        }
        console.log("requets is coming................", user._id);

        const {refreshToken  , accessToken} = await getAccessAndRefreshToken(user._id)
        console.log("userid.access" , accessToken);
        console.log("userid....refresh" , refreshToken);


        const loggedUser = await  User.findById(user._id)
        console.log("dhv........" , loggedUser);
        

        // const options = {
        //     httpOnly: true,
        //     secure:false
        // }
        
        return  res.status(201)
        .cookie("accessToken" , accessToken , options)
        .cookie("refreshToken" , refreshToken , options)
        .json( new ApiResponse(201 , "user login successfully" , {user: loggedUser , accessToken ,refreshToken} ))


} catch (error) {
    console.log("error:", error.message);
    
}
})

export const logOut = asyncHandler( async(req , res)=>{

    await User.findByIdAndUpdate(req.user._id , {
    $set: {
        refreshToken:undefined
    }  
 },
 {
    new:true
 }
)

//   const options = {
//             httpOnly: true,
//             secure:false
//         } 

        return res.status(201)
        .clearCookie("accessToken" , options)
        .clearCookie("refreshToken" , options)
        .json({} , "user logged out ")



    // console.log("hit logout");
    

//clear refresh token and accesstoken
//clear cookies


})

export const getRefreshToken = asyncHandler(async (req , res)=>{
// user routes to refresh tokn
// user send refresh token
// get refresh token from cookies
//if not error
//if token decode get id from token
//find query for users 
// if user.refresh prvious save 
// comare noth if not mtch 
// send new token in response and cookie
const incomingRefreshToken =  req.cookies?.refreshToken || req.get("Authorization").replace("Bearer " , "")

console.log("refresh ttt..." , incomingRefreshToken);


const decodedToken = jwt.verify(incomingRefreshToken , process.env.REFRESH_TOKEN_SECRET);

console.log("decode token........." , decodedToken);

const user = await User.findById(decodedToken._id);

console.log("userrrrr refresss" , user);


if(incomingRefreshToken !== user.refreshToken){
    throw new ApiError(401 , "unauthorized request")
}

const {accessToken , refreshToken} = await getAccessAndRefreshToken(user._id);

return res.status(200)
.cookie("accessToken" , accessToken , options)
.cookie("refreshToken" ,refreshToken , options)
.json(new ApiResponse(201 , "refreshed successfully" , {accessToken , refreshToken}))



// const decodedToken = 


// try {
//     if(!incomingRefreshToken ){
//         throw new ApiError(404 , "refresh token not found")
//     }
    
//     // console.log(req.user);
    
    
//     const user = await User.findById(req.user._id);
    
//     console.log("refrsssssssssss.." , user.refreshToken);
    
    
//     if(incomingRefreshToken !== user.refreshToken){
//         throw new ApiError(404 , "refresh token is expired or invalid")
//     } else{
        
//        const {accessToken , newRefreshToken} = await getAccessAndRefreshToken(user._id)
//        console.log("user,,,,,," , accessToken );
       
    
//     //    user.refreshToken = newRefreshToken;
//     //    await user.save({validateBeforeSave: false})
    
//        return res.status(200)
//        .cookie("accessToken" , accessToken , options)
//        .cookie("refreshToken",newRefreshToken , options)
//        .json(new ApiResponse(200 , "new token generated" , {accessToken , newRefreshToken}))
    
//     }
// } catch (error) {
//     console.error("error" ,error.message);
    
// }


// // console.log("user...........new user" , user);

// // if()

// // if(incomingRefreshToken !== )
})


const changeOldPassword = asyncHandler(async function(req ,res){
// reqbody to get data from frontend
// get user data to use functon get from req.user because user is logged in
// use bcrypt compare password use isPaaswordfunction
// match old password with databse stored password
// if matches true 
// update new password and save in db



try {
    
        const {oldPassword , newPassword} = req.body;
    
        const user = await User.findById(req.user._id);
    
       const PasswordCorrect = await user.isPasswordCorrect(oldPassword)
    
       console.log("ISPASSWORD" , PasswordCorrect);
       
    
       if(!PasswordCorrect){
        throw new ApiError(401 , "invalid password")
       }
    
        user.password = newPassword;
        await user.save({validateBeforeSave:true})

       return res.status(201)
       .json(new ApiResponse(201 , "password changed successfully" , {}))

} catch (error) {
    throw new ApiError()
}
})


export {changeOldPassword};


// export const getCurrentUser =  ()

export const getCurrentUser = asyncHandler(async function(req , res) {

    console.log("hittt get current user");
    
    
    const user = await  User.findById(req.user?._id);
    console.log("get userrrrr" , user);
    

    return res.status(200)
    .json(new ApiResponse(200 , "user fetched successfully" , user))



})


export const updateLoggedUser = asyncHandler(async (req ,res) =>{

//need to take detail that need to update
//after validate is it not empty
//update user  finding user by req.user
//return response update user
console.log("hittt update userrr");


const {username , fullName , email} = req.body

console.log(username , "sssssssss");
console.log(fullName , "sssssssss");
console.log(email , "sssssssss");




if(!username || !fullName || !email){
    throw new ApiError(400 , "username and email will not be empty")
}

// const user = await User.findByIdAndUpdate({
    
//     _id:req.user.id

// },

// {$set : { user.fullname = fullName}

// }}
// )


const user = await User.findById(req.user.id);

console.log("userrrr test" , user);


user.fullName = fullName
user.email = email
user.username = username

user.save({validateBeforeSave:true})

console.log("new updated user....." , user);



return res.status(201)
.json(new ApiResponse(201 , "user updated successfully" , {user}))

})

export const deleteUser = asyncHandler( async (req , res)=>{
    console.log("hit delete user");
    

const {username} = req.params;

// console.log(username , "HDEHHEDH");

const deletedUser = User.findOneAndDelete({username}) 

console.log("DELELLE" , deletedUser);

 return res.status(201).json(new ApiResponse(200 , "user delete successfully" ,{} ))
})

export const updateAvatar = asyncHandler(async (req , res)=>{
    // console.log("hit iupdate" , req.file)
    // console.log("hit iupdate" , req.user);

    const avatarLocalPath = req.files.avatar[0].path

    
    const avatar = await uploaderCloudinary(avatarLocalPath)
    console.log("avatar path" , avatar);

    if(!avatar){
        throw new ApiError(400 , "avatar field is required")
    }
    const user = await User.findByIdAndUpdate(req.user.id , {
        $set:{
            avatar : avatar.url
        }
    }
        ,
        {new :true}
    )


    return res.status(201)
    .json(new ApiResponse(201 , "avatar updated successfully" , {user}))


    
    
    
    // console.log();
    
// take new avatar url 
// validate it 
// after validate update old in database
// send in response
// const updatedAvatar = req.files?.avatar
// console.log("req file" , req.files.avatar[0]);





})

export const updateCoverImage = asyncHandler(async (req , res)=>{
    // console.log("hit iupdate" , req.file)
    // console.log("hit iupdate" , req.user);

    const coverImageLocalPath = req.files.coverimage[0].path

    
    const coverimage = await uploaderCloudinary(coverImageLocalPath)
    console.log("avatar path" , coverimage);

    if(!coverimage){
        throw new ApiError(400 , "coverimage field is required")
    }
    const user = await User.findByIdAndUpdate(req.user.id , {
        $set:{
            coverimage : coverimage.url
        }
    }
        ,
        {new :true}
    )
  
    return res.status(201)
    .json(new ApiResponse(201 , "coverimage updated successfully" , {user}))


    
    
    
    // console.log();
    
// take new avatar url 
// validate it 
// after validate update old in database
// send in response
// const updatedAvatar = req.files?.avatar
// console.log("req file" , req.files.avatar[0]);





})

// need to delete   old avatar   
export const getUserChannelProfile = asyncHandler(async (req ,res)=>{

    console.log("hit get user profileeee");
    

// find user
//match is used to find like eg. username and username params
// lookup value
// subscriber  from channel and their subcribed user from  subscriber field
  const {username} = req.params
  
  if(!username){
    throw new ApiError(400 , "user not found")
  }

const channel = await User.aggregate([{
    $match:{
        username: username
    }
  },
{
    $lookup:{
        from:"subscriptions",
        localField:"_id",
        foreignField:"channel",
        as:"subscribers"
    }
},
{
    $lookup:{
        from:"subscriptions",
        localField:"_id",
        foreignField:"subscriber",
        as:"subscribedTo"

    }
},
{
    $addFields:{
        subcribersCount:{
            $size:"$subscribers"
        },
        
        channelSubscribedToCount:{
            $size :"$subscribedTo"
        },

        isSubscribed:{
            $cond: {
                if:{$in :[req.user._id , "$subscribers.subscriber"]},
                then:true ,
                else: false    
            } 
        }

    }
},{
    $project:{
        fullName:1,
        username:1,
        subcribersCount:1,
        channelSubscribedToCount:1,
        isSubscribed:1,
        email:1,
        avatar:1,
        coverimage:1

    }
}])

console.log("channelll" , channel);

if (!channel){
    throw new ApiError(400 , "channel not found")
}

return res.status(200)
.json(new ApiResponse(200 , "channel fetched successfully" , channel[0]))


})

export const getWatchHistory = asyncHandler(async (req, res) => {
  console.log("hit get watch history");

  const user = await User.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(req.user._id) }
    },
    {
      $lookup: {
        from: "videos",
        // let: { videoIds: "$watchHistory" },
        localField:"watchHistory",
        foreignField:"_id",
        as:"watchHistory" ,
        pipeline:[{

            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner" ,
              pipeline:[{
                  
                                  $project:{
                                      avatar:1,
                                      email:1,
                                      watchHistory:1,
                                      
                                  }
              
              
                
              }]
            }}]
        }},{
            $addFields:{
                owner:{
                $first:"$owner"
            }
        }}
              
  ]);

  if (!user || user.length === 0) {
    throw new ApiError(400, "No user found");
  }
console.log("tffffffff,", user);

  return res.status(200).json(
    new ApiResponse(200, "Watch history fetched successfully", user[0].watchHistory)
  );
});
