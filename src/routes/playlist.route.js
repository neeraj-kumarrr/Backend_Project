
import { protect } from "../middlewares/auth.middleware.js"
import express from "express"
import { createPlaylist } from "../controllers/playlist.Controller.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = express.Router()

router.post("/create-playlist" , protect , upload.fields([{"name":"videos" , maxCount: 10} ]) , createPlaylist)


export default router;