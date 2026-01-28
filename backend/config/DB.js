import mongoose from "mongoose";

const connectionTODB=async()=>{
   try {
    const response=await mongoose.connect(process.env.MONGODB_URL)
    console.log("DB is connected",response.connection.host)
   } catch (error) {
    console.log("DB is failed to connect",error?.message)
   }
}

export default connectionTODB;