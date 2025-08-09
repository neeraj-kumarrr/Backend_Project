
import { protect } from "../middlewares/auth.middleware.js"
import express from "express"
import { createPlaylist, getPlaylistById, getUserPlaylist } from "../controllers/playlist.Controller.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = express.Router()

router.post("/create-playlist" , protect , upload.fields([{"name":"videos" , maxCount: 10} ]) , createPlaylist)
router.get("/get-user-playlist/:userId" , protect , getUserPlaylist)
router.get("/get-playlist/:playlistId" , protect , getPlaylistById)


export default router;