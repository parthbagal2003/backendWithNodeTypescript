import express from "express"
import userRoute from "./routes/userRoutes.js";
import cookieParser from "cookie-parser"
import datasource from "./config/connectDB.js";

const app = express()

app.listen(8000,()=>{
    console.log("App is running on port 8000");
    
})




datasource.initialize().then(()=>{
    console.log("Connected to database");
    
}).catch((error)=>{
    console.log(error);
    
    console.log("Database connection error");
    
})


app.use(express.json())
app.use(cookieParser())

app.use("/api/v1/user",userRoute)



