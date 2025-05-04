import express from "express"
import dotenv from "dotenv"
import { connectDb } from "./lib/db.js";
import { authRoutes } from "./routes/auth.routes.js";
import { adminRoutes } from "./routes/admin.routes.js";
import { userRoutes } from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors"
dotenv.config()
let app=express();
app.use(cors({credentials:true,origin:"http://localhost:5173"}));
app.use(cookieParser());
app.use(express.json({limit:"20mb"}));
app.use(express.urlencoded({limit:'20mb',extended:true}))
app.use("/api/auth",authRoutes);
app.use("/api/user",userRoutes);
app.use("/api/admin",adminRoutes);
app.listen(process.env.PORT,async ()=>{
    console.log("server start")
    await connectDb()
})