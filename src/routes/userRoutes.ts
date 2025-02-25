import express from "express";
import userAuth from "../controllers/userControllers.js";
import { authHandler } from "../auth/auth.js";


const router = express.Router()

router.post("/register",userAuth.Register)
router.post("/login",userAuth.login)
router.post("/logout",authHandler,userAuth.logout)
export default router

