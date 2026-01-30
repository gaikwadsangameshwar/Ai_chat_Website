import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";


const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } 
  catch (error) {
    throw new ApiError(500, "Error while generating tokens");
  }
};


const registerUser=asyncHandler(async(req,res)=>{

  try {
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
  } 
  catch (error) {
    throw new ApiError(500,"Registration is Failed")
  }
})

const LoginUser = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;

  console.log("password",password)

  if ((!fullname && !email) || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({
    $or: [{ fullname }, { email }],
  });

  if (!user) {
    throw new ApiError(401, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password");
  }

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

const LogoutUser=asyncHandler(async(req,res)=>{
  res.clearCookie("accessToken")
  res.clearCookie("refreshToken")

  return res
  .status(200)
  .json(new ApiResponse(
        200,
        "User logout successfully"
      ))
})

const getUser=asyncHandler(async(req,res)=>{
   return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})

const getAllUser=asyncHandler(async(req,res)=>{
  const user=await User.find({}).select("-password -refreshToken")

  if(!user){
    throw new ApiError(401,"User is Not getting")
  }

  return res.status(200).json(
    new ApiResponse(200,
      user,
      "Get All User"
    )
  )

})


export {
  registerUser,LoginUser,LogoutUser,getUser,getAllUser
} 