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
import datasource from "../config/connectDB.js";
import UserTable from "../entities/User.js";
dotenv.config();
const userTable = datasource.getRepository(UserTable);
export const authHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.authCookie;
    console.log(req.cookies, "\n");
    if (!token) {
        res.status(500).json({
            success: false,
            message: "You are not authenticated"
        });
        return;
    }
    console.log("token : ", token);
    const data = jwt.verify(token, process.env.SECRET_KEY);
    console.log(data);
    const isUserPresent = yield userTable.findBy({
        email: data === null || data === void 0 ? void 0 : data.email
    });
    if ((isUserPresent === null || isUserPresent === void 0 ? void 0 : isUserPresent.length) === 0) {
        res.status(500).json({
            success: false,
            message: ""
        });
        return;
    }
    next();
});
