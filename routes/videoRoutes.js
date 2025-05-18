import express from 'express';

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

router.put('/update/:id',checkAuth,async(req,res)=>{
  try {
    const {title,desc,category,tags} = req.body;
    const videoId = req.params.id;

    let video = await Video.findById(videoId);

    if (!video) {
        return res.status(404).json({
            message:'Video not found'
        })
    }

    if (video.user_id.toString() !== req.user_id.toString()) {
        return res.status(403).json({
            message:'Unauthorized user'
        })
    };

    if (req.files && req.files.thumbnail) {
        await cloudinary.uploader.destroy(video.thumbnailId);

        const thumbnailUpload = await cloudinary.uploader.upload(
            req.files.thumbnail.tempFilePath,{
                folder:'thumbnail'
            }
        );

        video.thumbnailUrl = thumbnailUpload.secure_url;
        video.thumbnailId = thumbnailUpload.public_id;
    }

    video.title = title || video.title
    video.desc = desc || video.desc
    video.category = category || video.category
    video.tags = tags ? tags.split(',') : video.tags;

    await video.save()

    res.status(200).json(
        {
            message:'Video updated Successfully',
            video
        }
    )

  } catch (error) {
        res.status(500).json(
            {
                error:"Something Went Wrong",
                message:error.message
            }
        )
  }  
})

router.delete('/delete/:id',checkAuth,async(req,res)=>{
    try {
        const videoId = req.params.id;

        let video = await Video.findById(`video/${videoId}`);
        if (!video) {
            return res.status(404).json({
                error:"Video not found"
            })
        }

        if (video.user_id.toString() !== req.user_id.toString()) {
            return res.status(403).json({
                message:'Unauthorized user'
            })
        };

        await cloudinary.uploader.destroy(video.videoId, { resource_type: "video" });
        await cloudinary.uploader.destroy(video.thumbnailId);

        await Video.findByIdAndDelete(videoId)

        res.status(200).json({ message: "Video deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });s
    }
})

export default router;
