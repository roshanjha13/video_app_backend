import express from "express";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";

import { connectDB } from "./config/dbconfig.js";
import userRoutes from './routes/userRoutes.js'

dotenv.config()

const app = express();

connectDB()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:'/tmp/'
}))

app.use('/v1/user',userRoutes)

const PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
    
})