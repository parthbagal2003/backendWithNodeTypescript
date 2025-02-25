import { NextFunction, RequestHandler } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import dotenv from "dotenv"
import datasource from "../config/connectDB.js"
import UserTable from "../entities/User.js"
import { User } from "../utils/user.js"

dotenv.config()


const userTable = datasource.getRepository(UserTable)

export const authHandler:RequestHandler = async(req,res,next:NextFunction)=>{
    const token = req.cookies.authCookie

    console.log(req.cookies,"\n");

    if(!token){
        res.status(500).json({
            success:false,
            message:"You are not authenticated"
        })

        return
    }
    
    console.log("token : ",token);

    const data:JwtPayload|string = jwt.verify(token,process.env.SECRET_KEY as string)

    console.log(data);

   

    

    const isUserPresent = await userTable.findBy({
        email:(data as User)?.email
    })



    if(isUserPresent?.length === 0){
        res.status(500).json({
            success:false,
            message:""
        })

        return
    }

   

    
    

    next()
    

}