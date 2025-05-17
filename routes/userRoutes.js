import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/userModel.js';
import cloudinary from '../config/cloudinary.js';
import jwt from 'jsonwebtoken'
const router = express.Router()

router.post('/signup',async(req,res)=>{
    try {
        console.log("req");
        
        const hashedPassword = await bcrypt.hash(req.body.password,10);

        const uploadImage = await cloudinary.uploader.upload(
            req.files.logoUrl.tempFilePath
        )        

        const newUser = new User({
            channelName : req.body.channelName,
            email : req.body.email,
            phone : req.body.phone,
            password:hashedPassword,
            logoUrl:uploadImage.secure_url,
            logoId:uploadImage.public_id
        })
        let user = await newUser.save();
        res.status(201).json({
            user
        })
    } catch (error) {
        res.status(500).json({
            message:"something went wron"
        })
    }
})

router.post('/login', async(req,res)=>{
    try {
        const existigUser = await User.findOne({email:req.body.email})

        if (!existigUser) {
            return res.status(404).json(
                {
                    message:"User not found"
                }
            )
        }

        const isValid = await bcrypt.compare(
            req.body.password,
            existigUser.password
        )

        if (!isValid) {
         return res.status(500).json({
            message:"Email and Password are not matched"
         })
        }

        const token = jwt.sign(
            {
                _id:existigUser._id,
                channelName:existigUser.channelName,
                email:existigUser.email  
            },
            process.env.JWT_SECRET,
            {
                expiresIn:process.env.JWT_EXPIRE
            }
        )

        res.status(200).json({
                _id:existigUser._id,
                channelName:existigUser.channelName,
                email:existigUser.email,
                phone:existigUser.phone,
                logoId:existigUser.logoId,
                logoUrl:existigUser.logoUrl,
                subscribers:existigUser.subscribers,
                subsribedChannel:existigUser.subsribedChannel,
                token:token,
            }
        )
    } catch (error) {
        res.status(500).json({
            message:"something went wrong"
        })
    }
})

export default router;
