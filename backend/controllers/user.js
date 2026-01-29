import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";


const registerUser=asyncHandler(async(req,res)=>{

    const {fullname,email,password}=req.body

    if(!fullname || !email || !password){
        throw new ApiError(409,"All Fileds Are Required")
    }

    const UserExisted = await User.findOne({email})

    if(UserExisted){
        throw new ApiError(401,"User already exists with this email")
    }

    const user=await User.create({
        fullname,
        email,
        password
    })

    const createdSaved=await User.findById(user._id).select("-password -refreshToken")

    return res
    .status(201)
    .json(
      new ApiResponse(201, createdSaved, "User registered successfully")
    );
})

const LoginUser=asyncHandler(async(req,res)=>{
    const {email,username}=req.body

    console.log("Email",email)

    if(!email && !username){
        throw new ApiError(409,"All Fields are required")
    }

    const findUser=await User.findOne({$or:[
        {email},{username}
    ]})

    if(!findUser){
        throw new ApiError(401,"User does not existed")
    }

    


})

const LogoutUser=asyncHandler(async(req,res)=>{

})

export {
    registerUser,LoginUser,LogoutUser
}