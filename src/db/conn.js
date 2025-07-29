import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"

import dotenv from "dotenv"

dotenv.config()
let env = process.env.MONGO_URI

// console.log("envvv" , env);

 const connectDB = async ()=>{
        try {
            const mongo_instance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
            
            console.log("Mongodb Connected" , mongo_instance.connection.host)
        } catch (error){
            console.error("error is" , error)
            process.exit(1)
        }
        };
        // connectDB()

    export default connectDB; 