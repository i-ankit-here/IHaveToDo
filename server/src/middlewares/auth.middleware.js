import jwt from "jsonwebtoken"
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const verifyJWT = asyncHandler (async (req,res,next)=>{
    // console.log(req.cookies);
    const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
    if(!accessToken){
        throw new apiError(401,"Unauthorized Request")
    }
    // console.log(accessToken);
    const decodedToken = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id).select("-password -refreshToken");
    // console.log("decodedToken: ",decodedToken);
    if(!user)throw new apiError(401,"Invalid Token")
    req.user = user;
    next();
})

export {verifyJWT}