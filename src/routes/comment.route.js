
import express from "express"
import { addComment, deleteComment, getVideoComment, updateComment } from "../controllers/comment.Controller.js"
import { protect } from "../middlewares/auth.middleware.js"
import { getVideoById } from "../controllers/video.Controller.js"

const router = express.Router()

router.post("/add-comment/:videoId" , protect , addComment)
router.get("/get-comment/:videoId" , protect , getVideoComment)
router.put("/update-comment/:commentId" , protect , updateComment)
router.delete("/delete-comment/:commentId" , protect , deleteComment)

export default router ;
