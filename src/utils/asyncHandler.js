// import { promises } from "nodemailer/lib/xoauth2"

//  export const asyncHandler = (requestHandler) =>{
//     return (req,res , next)=>{
//         promise.resolve(requestHandler(req ,res, next)).catch((err)=> next(err))
//     }
// }


const asyncHandler = (fn) => async (req , res , next) =>{
    try{
        await fn(req ,res , next)
    } catch (error){
        res.status(Number(error.code) || 404).json({
            success : false,
            message: error.message
        })
    }
}

export {asyncHandler};