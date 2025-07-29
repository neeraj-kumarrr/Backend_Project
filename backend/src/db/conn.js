import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"

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