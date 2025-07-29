import express from "express"
import { postAVideo } from "../controllers/video.Controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { protect } from "../middlewares/auth.middleware.js"
const router = express.Router()


router.post("/upload" , protect ,upload.fields([{ name:"video" , maxCount:10},{name:"thumbnail" ,maxCount:5}]) , postAVideo)



export default router;


