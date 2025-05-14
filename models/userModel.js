import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        channel:String,
        email:{
            type:String,
            unique:true,
        },
        phone:String,
        password:String,
        logoUrl:String,
        logoId:String,
        subscribers:Number,
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