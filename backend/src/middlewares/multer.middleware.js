import { log } from "console"
import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"


const  __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const uploadDir = path.join(__dirname , "../../public")

const storage = multer.diskStorage({
    destination : function (req, file , cb){
        cb(null , uploadDir)

    },
    
    filename : function (req , file , cb){
        cb(null , file.originalname)
        // console.log("FILES:" , req.files.video[0].path);
    }
    
})

export const upload = multer({storage })

export const  uploader = upload.fields([{
    name:"avatar" , maxCount:10
} , {name:"coverimage" , maxCount:10}]
)






// console.log("NEW FLES.........." , req.files);
