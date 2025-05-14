import mongoose from "mongoose" 

export const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("database connected");
        
    } catch (error) {
        throw new Error("Something Went Wrong ", error);
    }
}