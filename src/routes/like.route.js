import express from "express";
import { CommentLikeToggle, getLikedVideo, toggleVideoLike, tweetLikeToggle } from "../controllers/like.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router()

router.post("/toggle-videolike/:videoId" , protect , toggleVideoLike)
router.post("/toggle-commentlike/:commentId" , protect , CommentLikeToggle)
router.post("/toggle-tweetlike/:tweetId" , protect , tweetLikeToggle)
router.get("/get-likedvideos" , protect , getLikedVideo)

export default router;