import { Router } from "express";
import { LoginUser, registerUser } from "../controllers/User.js";

const router=Router()

router.route("/register").post(registerUser)
router.route("/login").post(LoginUser)

export default router