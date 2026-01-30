import { Router } from "express";
import { getAllUser, getUser, LoginUser, LogoutUser, registerUser } from "../controllers/User.js";
import { isAdmin, verifyJWT } from "../middlewares/auth.js";

const router=Router()

router.route("/").get(verifyJWT,isAdmin,getAllUser)
router.route("/register").post(registerUser)
router.route("/login").post(LoginUser)
router.route("/logout").post(verifyJWT,LogoutUser)
router.route("/getuser").get(verifyJWT,getUser)


export default router