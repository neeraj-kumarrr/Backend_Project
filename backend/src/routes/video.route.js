import express from "express"
import { deleteVideo, getAllVideos, getVideoById, postAVideo, togglePublishStatus, updateVideo } from "../controllers/video.Controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { protect } from "../middlewares/auth.middleware.js"
const router = express.Router()


router.post("/upload" , protect ,upload.fields([{ name:"video" , maxCount:10},{name:"thumbnail" ,maxCount:5}]) , postAVideo)
router.get("/get-videos" , protect , getAllVideos )
router.get("/get-views/:videoId" , protect , getVideoById)
router.put("/update-videos/:videoId" , protect , upload.single("thumbnail") , updateVideo)
router.delete("/delete-videos/:videoId" , protect , deleteVideo )
router.put("/toggle-publishedstatus/:videoId" , protect , togglePublishStatus)


export default router;


