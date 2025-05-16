import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        channelName:{
            type :String
        },    
        email:{
            type:String,
            unique:true,
        },
        phone:{
            type :String
        },    
        password:{
            type :String
        },    
        logoUrl:{
            type :String
        },    
        logoId:{
            type :String
        },    
        subscribers:{
            type:Number,
            default:0
        },    
        subsribedChannel:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'User'
            }
        ]
    },
    {
      timestamps:true,
      versionKey:false  
    }
)

const userModel = mongoose.model('User',userSchema)

export default userModel;