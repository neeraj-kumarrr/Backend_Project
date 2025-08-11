    import dotenv from "dotenv"
    
    // import mongoose from "mongoose";
    import connectDB  from "./db/conn.js";

    import express from "express"

    import cookieParser from "cookie-parser";

    import userRouter from "./routes/user.route.js"
    import videoRouter from "./routes/video.route.js"
    import tweetRouter from "./routes/tweet.route.js"
    import subscriptionRouter from "./routes/subscription.route.js"
    import playlistRouter from "./routes/playlist.route.js"
    import commentRouter from "./routes/comment.route.js"

    import path from "path"
    import { fileURLToPath } from "url";

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)

    console.log("dirname" , __dirname);
    

    dotenv.config()
    const app = express()
    await connectDB()
    app.use(express.json({limit: "16kb"}))
    app.use(express.static("public"))
    app.use(express.urlencoded({extended:true , limit:"16kb"}))

    app.use(cookieParser())

    app.use("/api/v1/" , [
        userRouter ,
        tweetRouter ,
        subscriptionRouter ,
        playlistRouter ,
        commentRouter  
    ])
    app.use("/api/v1/video" , videoRouter)
    // app.use("/api/v1/" , tweetRouter )
    // app.use("/api/v1" , registerRouter)
    

        app.listen(process.env.PORT , ()=>{
            console.log("App is running on PORT", process.env.PORT );
            
        })

        // console.log("")
    
