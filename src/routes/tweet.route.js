import express from "express"
import { deleteTweet, getAllTweet, postTweet, updateTweet } from "../controllers/tweet.Controller.js"
import { protect } from "../middlewares/auth.middleware.js"

const router = express.Router()


router.post("/create-tweet" , protect , postTweet)
router.get("/get-tweet" , protect , getAllTweet)
router.put("/update-tweet/:tweetId" , protect , updateTweet)
router.delete("/delete-tweet/:tweetId" , protect , deleteTweet)


export default router ;