import express from "express"
import { forgetPassword, getProfile, Login, logout } from "../controllers/auth.controller.js";
import { protect } from "../middleware/middleware.js";
export const authRoutes=express.Router();
authRoutes.post("/login",Login);
authRoutes.get("/getme",protect,getProfile);
authRoutes.get("/logout",protect,logout);
authRoutes.post("/forget-password",forgetPassword);