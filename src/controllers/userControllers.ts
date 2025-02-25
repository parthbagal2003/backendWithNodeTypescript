import jwt from "jsonwebtoken"
import { User } from "../utils/user.js"
import { CookieOptions, RequestHandler } from "express" 
import dotenv from "dotenv"
import UserTable from "../entities/User.js"
import datasource from "../config/connectDB.js"
import "reflect-metadata"


dotenv.config()

const userTable = datasource.getRepository(UserTable)



const Register:RequestHandler = async(req,res)=>{
    try {
        const user = req?.body as User

        
        console.log(userTable);
        
        

        if(!user?.userName || !user?.email || !user?.password ){
            res.status(500).json({
                success:false,
                message:"All fields are required"
            })
        }

        const registeredUser = userTable.create({email:user?.email,name:user?.userName,password:user?.password})
        await userTable.save(registeredUser)

    


        res.status(200).json({
            success:true,
            message:"Registered Successfully"
        })


        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Something went wrong"
        })
        
        
    }

}

const login:RequestHandler = async(req,res)=>{
    try {
        const user = req?.body

        console.log("User 1",user);
        

        //let isUserPresent:Boolean = false
        

        const isUserPresent = await userTable.findBy({
            email:user?.email
        })

        console.log(isUserPresent[0]);
        

        if(isUserPresent?.length === 0){
            res.status(500).json({
                success:false,
                message:"Please register first"
            })

            return
        }

      
        
       if(isUserPresent[0]?.password !== user?.password){
        
            res.status(500).json({
                success:false,
                message:"Wrong password"
            })
            
            console.log("This is wrong");
            return
       }
        
       
        const payload = {
            id:isUserPresent[0].id,
            email:isUserPresent[0].email
        }

        const token:string =  jwt.sign(payload,process.env.SECRET_KEY as string,{
            expiresIn:"2d"
        })

        const options:CookieOptions = {
            httpOnly:true,
            secure:true,
            sameSite:"none",
            expires:new Date(Date.now() + 2*24*60*60*1000)
        }



        
        
        console.log("res is under this");
        
        res.status(200).cookie("authCookie",token,options).json({
            success:true,
            message:"Successfuly login"
        })
    } 
    catch (error) {
        console.log(error);
        
        res.status(500).json({
            success:false,
            message:"Something went wrong"
        })
        
    }
}




const logout:RequestHandler = async(req,res)=>{

    const user = req.body


    const isUserPresent = await userTable.findBy({
        email:user?.email
    })

    if(isUserPresent?.length === 0){
        res.status(500).json({
            success:false,
            message:"Please register first"
        })

        return
    }


    const options:CookieOptions = {
        httpOnly:true,
        secure:true,
        sameSite:"none",
        expires:new Date(Date.now() + 2*24*60*60*1000)
    }
    


    res.cookie("authCookie","",options).json({
        success:true,
        message:"Succesfully logout"
    })
}

const userAuth = {
    Register,
    login,
    logout
}

export default userAuth