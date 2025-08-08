
import {protect} from "../middlewares/auth.middleware.js"

import express from "express"
import { toggleSubscription, userChannelSubscribersList, userSubscribedChannel } from "../controllers/subscription.Controller.js"

const router= express.Router()


router.post("/toggle-subscriber/:channelId/" , protect , toggleSubscription)
router.get("/get-channelSubscribers/:channelId", protect , userChannelSubscribersList)
router.get("/get-subscribedChannel/:subscriberId" , protect , userSubscribedChannel)



export default router;