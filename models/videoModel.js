import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
    {
        title:{
            type :String,
            required:true,
            trim:true
        },    
        desc:{
            type:String,
            required:true,
            trim:true
        },
        user_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        videoUrl:{
            type :String,
            required:true,
            trim:true
        },
        videoId:{
            type :String,
            required:true,
            trim:true
        },    
        thumbnailUrl:{
            type :String,
            required:true,
            trim:true
        },    
        thumbnailId:{
            type :String,
            required:true,
            trim:true
        },    
        category:{
            type :String,
            required:true,
            trim:true
        },    
        tags:[
            {
                type :String,
                trim:true
            }
        ],    
        likes:{
            type :Number,
            default:0,
            min:0
        },    
        dislikes:{
            type :Number,
            default:0,
            min:0
        },    
        views:{
            type :Number,
            default:0,
            min:0
        },
        likedBy:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'User',
            }
        ],   
        dislikedBy:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'User',
            }
        ],   
        viewedBy:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'User',
            }
        ],   
            
    },
    {
      timestamps:true,
      versionKey:false  
    }
)

const videoModel = mongoose.model('Video',videoSchema)

export default videoModel;