import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiResponse} from "../utils/apiResponse.js"
// import apiError from "../utils/apiErrorHandler.js"

import mongoose , {Schema} from "mongoose"
import { Subscription } from "../models/subscription.model.js"
import { logOut } from "./userRegister.controller.js"


export const  toggleSubscription = asyncHandler(async (req ,res) =>{

    console.log("togglesubscriber hitt");
    

    const {channelId} = req.params

    const subscriberId = req.user._id
    console.log("subscriber id" , subscriberId);
    

    // const existingSubscriber = await Subscription.findbyId( {channelId : channelId , subscriber: subscriber})
    const existingSubscriber = await Subscription.findOne({channel: channelId , subscriber : subscriberId})

    console.log("existing subscriber" , existingSubscriber);
    

    if(existingSubscriber){

        await Subscription.findByIdAndDelete(existingSubscriber._id)
        
        return res.status(201).json( new ApiResponse(201 , "channel unsubscribed successfully" , {}))
        // throw new apiError(400 , "user already subscribed this channel")
    } else {

        const subscribed = await Subscription.create({subscriber:subscriberId , channel : channelId })
        return res.status(201).json( new ApiResponse(200 , "channel subscribed successfuly" , {subscribed}))
    }

})


export const userChannelSubscribersList = asyncHandler(async (req ,res)=>{

    console.log("hit channel subscribers");
    

    const {channelId} = req.params;

    const userSubscribers = await Subscription.find({channel :channelId})

    console.log("user Subscribers" , userSubscribers);
    

    return res.status(200).json( new ApiResponse(200 , "user subscriber fetched success" , {userSubscribers :userSubscribers}))


})

export const userSubscribedChannel = asyncHandler(async (req ,res)=>{

    const {subscriberId} = req.params

    const userChannelList = await Subscription.find({subscriber : subscriberId})

    return res.status(200).json( new ApiResponse(200 , "channel fetched successfully" , {userChannelList}))

})


