
import { protect } from "../middlewares/auth.middleware.js"
import express from "express"
import { addVideoToPlayList, 
    createPlaylist,
    deletePlaylist,
    getPlaylistById, 
    getUserPlaylist,
    removeVideoFromPlayist,
    updatePlaylist } from "../controllers/playlist.Controller.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = express.Router()

router.post("/create-playlist" , protect , upload.fields([{"name":"videos" , maxCount: 10} ]) , createPlaylist)
router.get("/get-user-playlist/:userId" , protect , getUserPlaylist)
router.get("/get-playlist/:playlistId" , protect , getPlaylistById)
router.put("/update-videoplaylist/:playlistId/:videoId" , protect , addVideoToPlayList)
router.put("/remove-video/:playlistId/:videoId" , protect , removeVideoFromPlayist)
router.delete("/delete-playlist/:playlistId" , protect , deletePlaylist)
router.put("/update-playlist/:playlistId" , protect , updatePlaylist)



export default router;