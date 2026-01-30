import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs"
import JWT from "jsonwebtoken"


const UserSchema=new Schema( {
    fullname:{
        type:String,
        required:[true,"Fullname is Required"],
        index:true,
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true,"Email is Required"],
        unique:true,
        index:true
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        trim:true
    },
    refreshToken: {
        type: String,
        select: false,
    }
    },{
    timestamps:true
})

UserSchema.pre("save",async function(){
    if(!this.isModified("password")) return;
    this.password =await bcrypt.hash(this.password,10)
})

UserSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}

UserSchema.methods.generateAccessToken=function(){
    return JWT.sign(
        {
            _id:this._id,
            fullname:this.fullname,
            email:this.email,
            password:this.password
        },
            process.env.ACCESS_TOKEN_SECRET,
        {
           expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

UserSchema.methods.generateRefreshToken=function(){
    return JWT.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET ,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const User=mongoose.model("User",UserSchema)

export default User;