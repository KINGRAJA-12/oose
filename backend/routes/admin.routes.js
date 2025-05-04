import express from 'express'
import { isAdmin, protect } from '../middleware/middleware.js';
import { addEmployee, deleteEmployee, getAllEmployee, updateEmployee, viewEmployee } from '../controllers/admin.controller.js';
export const adminRoutes=express.Router();
adminRoutes.post("/create-employee",protect,isAdmin,addEmployee);
adminRoutes.get("/delete-employee/:id",protect,isAdmin,deleteEmployee);
adminRoutes.post("/update-exployee/:id",protect,isAdmin,updateEmployee);
adminRoutes.get("/view-employee/:id",protect,isAdmin,viewEmployee);
adminRoutes.get("/get-all-employee",protect,isAdmin,getAllEmployee);