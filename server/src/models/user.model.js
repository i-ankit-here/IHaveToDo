import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"


const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: [true, "Username already exists"],
            lowercase: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            lowercase: true,
            unique: [true, "email already exists"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        firstname: {
            type: String,
            required : [true,"First name is required"]
        },
        lastname: {
            type: String,
            default: ""
        },
        avatar : String,
        refreshToken : String
    },
    { timestamps: true }
)

userSchema.pre("save",async function(next){
    if(!this.isModified("password"))return next();
    this.password = bcrypt.hash(this.password,10);
    nect();
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessTokens = function(){
    return jwt.sign({
        _id: this._id,
        username: this.username,
        email : this.email,  
        firstname : this.firstname,
        lastname : this.lastname
    },
    process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY}
)
}
userSchema.methods.generateRefreshTokens = function(){
    return jwt.sign({
        _id: this._id,
        username: this.username,
        email : this.email,  
        firstname : this.firstname,
        lastname : this.lastname
    },
    process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY}
)}
export const User = mongoose.model("User",userSchema);