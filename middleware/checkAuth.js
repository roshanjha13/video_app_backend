import jwt from "jsonwebtoken"

export const checkAuth = async(req,res,next)=>{
    try {
       const isToken = req.headers.authorization?.split(" ")[1]

       if (!isToken) {
        return res.status(401).json({
            message:"No token is provided"
        })
       }

       const decodedUser = jwt.verify(isToken,process.env.JWT_SECRET);

       req.user = decodedUser;

       next();
    } catch (error) {
        res.status(500).json({
            error:"Something went wrong",
            message:error.message
        })
    }
}