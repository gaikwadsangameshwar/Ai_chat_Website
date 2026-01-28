import app from "./app.js"
import connectionTODB from "./config/DB.js"
const PORT= process.env.PORT || 5000

app.listen(PORT,async()=>{
    console.log(`http://localhost:${PORT}`)
    await connectionTODB()
})