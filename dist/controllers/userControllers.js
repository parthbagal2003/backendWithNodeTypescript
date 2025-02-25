var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserTable from "../entities/User.js";
import datasource from "../config/connectDB.js";
import "reflect-metadata";
dotenv.config();
const userTable = datasource.getRepository(UserTable);
const Register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req === null || req === void 0 ? void 0 : req.body;
        console.log(userTable);
        if (!(user === null || user === void 0 ? void 0 : user.userName) || !(user === null || user === void 0 ? void 0 : user.email) || !(user === null || user === void 0 ? void 0 : user.password)) {
            res.status(500).json({
                success: false,
                message: "All fields are required"
            });
        }
        const registeredUser = userTable.create({ email: user === null || user === void 0 ? void 0 : user.email, name: user === null || user === void 0 ? void 0 : user.userName, password: user === null || user === void 0 ? void 0 : user.password });
        yield userTable.save(registeredUser);
        res.status(200).json({
            success: true,
            message: "Registered Successfully"
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = req === null || req === void 0 ? void 0 : req.body;
        console.log("User 1", user);
        //let isUserPresent:Boolean = false
        const isUserPresent = yield userTable.findBy({
            email: user === null || user === void 0 ? void 0 : user.email
        });
        console.log(isUserPresent[0]);
        if ((isUserPresent === null || isUserPresent === void 0 ? void 0 : isUserPresent.length) === 0) {
            res.status(500).json({
                success: false,
                message: "Please register first"
            });
            return;
        }
        if (((_a = isUserPresent[0]) === null || _a === void 0 ? void 0 : _a.password) !== (user === null || user === void 0 ? void 0 : user.password)) {
            res.status(500).json({
                success: false,
                message: "Wrong password"
            });
            console.log("This is wrong");
            return;
        }
        const payload = {
            id: isUserPresent[0].id,
            email: isUserPresent[0].email
        };
        const token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: "2d"
        });
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
        };
        console.log("res is under this");
        res.status(200).cookie("authCookie", token, options).json({
            success: true,
            message: "Successfuly login"
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    const isUserPresent = yield userTable.findBy({
        email: user === null || user === void 0 ? void 0 : user.email
    });
    if ((isUserPresent === null || isUserPresent === void 0 ? void 0 : isUserPresent.length) === 0) {
        res.status(500).json({
            success: false,
            message: "Please register first"
        });
        return;
    }
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    };
    res.cookie("authCookie", "", options).json({
        success: true,
        message: "Succesfully logout"
    });
});
const userAuth = {
    Register,
    login,
    logout
};
export default userAuth;
