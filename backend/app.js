import { config } from "dotenv";
import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"
import userRoutes from "./routes/user.js"


config()
const app=express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials:true,
    origin:process.env.CLIENT_URL
}))

app.use("/api/v2/user",userRoutes)

app.use("/",(req,res)=>{
    res.send("Hello World")
})

export default app