import { config } from "dotenv";
import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"

config()
const app=express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials:true,
    origin:process.env.CLIENT_URL
}))

app.use("/",(req,res)=>{
    res.send("Hello World")
})

export default app