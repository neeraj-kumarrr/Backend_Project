// import route from "router"
// import router from "router"
import { uploader } from "../middlewares/multer.middleware.js";
// import { loginUser } from "../controllers/userRegister.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { changeOldPassword, deleteUser, getCurrentUser, getRefreshToken, getUserChannelProfile, getWatchHistory, updateAvatar, updateCoverImage, updateLoggedUser } from "../controllers/userRegister.controller.js";

import express from "express"
const router = express.Router()
import { loginUser, logOut, RegisterUser } from "../controllers/userRegister.controller.js";

router.post("/registeruser" , uploader ,
     RegisterUser )

router.post("/login"  , loginUser )
router.post("/logout" , protect , logOut)
router.post("/refresh-token" ,getRefreshToken)
router.post("/change-password" ,protect , changeOldPassword)
router.get("/user" , protect , getCurrentUser)
router.put("/update" , protect , updateLoggedUser)
router.delete("/delete/:username" , protect , deleteUser  )
router.put("/update-avatar" ,uploader ,protect, updateAvatar )

router.put("/update-coverimage" ,uploader ,protect, updateCoverImage )
router.get("/user-profile/:username" , protect , getUserChannelProfile)
router.get("/get-watch-history" , protect , getWatchHistory)



export default router;

