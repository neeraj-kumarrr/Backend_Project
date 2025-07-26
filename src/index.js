    import dotenv from "dotenv"
    
    // import mongoose from "mongoose";
    import connectDB  from "./db/conn.js";

    import express from "express"

    import cookieParser from "cookie-parser";

    import userRouter from "./routes/user.routes.js"

    dotenv.config()
    const app = express()
    await connectDB()
    app.use(express.json({limit: "16kb"}))
    app.use(express.static("public"))
    app.use(express.urlencoded({extended:true , limit:"16kb"}))

    app.use(cookieParser())

    app.use("/api/v1" , userRouter)
    // app.use("/api/v1" , registerRouter)
    

        app.listen(process.env.PORT , ()=>{
            console.log("App is running on PORT", process.env.PORT );
            
        })

        // console.log("")
    
