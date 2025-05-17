import express from 'express';

import User from '../models/userModel.js';
import Video from '../models/videoModel.js';

import cloudinary from '../config/cloudinary.js';
import { checkAuth } from '../middleware/checkAuth.js';

const router = express.Router()

router.post('/upload', checkAuth ,async(req,res)=>{
    try {
        const {title,desc,category,tags} = req.body

        if (!req.files || !req.files.video || !req.files.thumbnail) {
            return res.status(400).json(
                {
                    error:"Video and Thumbnail are required"
                }
            )    
        }

        const videoUpload = await cloudinary.uploader.upload(
            req.files.video.tempFilePath,{
                resource_type:'video',
                folder:'videos'
            }
        );

        const thumbnailUpload = await cloudinary.uploader.upload(
            req.files.thumbnail.tempFilePath,{
                folder:'thumbnail'
            }
        )

        const newVideo = await Video(
            {
             title,
             desc,
             category,
             tags:tags ? tags.split(','):[],
             user_id:req.user_id,
             videoUrl:videoUpload.secure_url,
             videoId:videoUpload.public_id,   
             thumbnailUrl:thumbnailUpload.secure_url,
             thumbnailId:thumbnailUpload.public_id,   
            }
        )

        const video = await newVideo.save()

        res.status(201).json({
            message:'Video uploaded successfully',
            video
        })

    } catch (error) {
        res.status(500).json(
            {
                error:"Something Went Wrong",
                message:error.message
            }
        )
    }
})


export default router;
