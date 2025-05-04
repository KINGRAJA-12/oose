import express from "express"
import { protect } from "../middleware/middleware.js";
import { getMonthlySummary, getTotalPresentDays } from "../controllers/user.controller.js";
export const userRoutes=express.Router();
userRoutes.get("/get-analysis/:userId",protect,getTotalPresentDays);
userRoutes.get("/get-total-present/:userId",protect,getMonthlySummary);