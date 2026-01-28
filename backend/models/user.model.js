import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs"

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
    avatar:{
        type:String,
        requied:true
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

UserSchema.methods.PasswordCorrect=async function(){
    return await bcrypt.compare(password,this.password)
}

const User=mongoose.model("User",UserSchema)

export default User;