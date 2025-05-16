import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/userModel.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router()

router.post('/signup',async(req,res)=>{
    try {
        console.log("req");
        
        const hashedPassword = await bcrypt.hash(req.body.password,10);
        console.log("pass",hashedPassword);
        
        const uploadImage = await cloudinary.uploader.upload(
            req.files.logoUrl.tempFilePath
        )

        console.log("uploadImage",uploadImage);
        

        const newUser = new User({
            channelName : req.body.channelName,
            email : req.body.email,
            phone : req.body.phone,
            password:hashedPassword,
            logoUrl:uploadImage.secure_url,
            logoId:uploadImage.public_id
        })
        console.log("newUser",newUser)
        let user = await newUser.save();
        console.log("user",user)
        res.status(201).json({
            user
        })
    } catch (error) {
        
    }
})

export default router;
