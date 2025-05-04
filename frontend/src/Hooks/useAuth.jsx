import {create} from "zustand"
import toast from "react-hot-toast"
import { axiosInstance } from "../axiosInstance.js"
let useAuth=create((set)=>({
    isLogin:false,
    isCreate:false,
    isFetching:false,
    users:null
,    login:async(data)=>{
        try{
            set({isLogin:true})
            console.log(data)
            let res=await axiosInstance.post("/auth/login",data);
            if(res.status===200){
                toast.success("login successfully")
            }
        }catch(err){
            console.log(err?.message)
            throw new Error(err?.response?.data?.message||"failed to login");
        }finally{
            set({isLogin:false})
        }},
        createEmployee:async(data)=>{
            try{
                set({isCreate:true})
                let res=await axiosInstance.post("/admin/create-employee",data);
                toast.success("Employee created successfully")
            }catch(err){

            }finally{
                set({isCreate:false})
            }
        },
        logoutHandle:async()=>{
            try{
                let res=await axiosInstance.get("/auth/logout");
                toast.success("logout sucessfully")
            
            }catch(err){
                toast.error("logout successfully");
            }
        }
}))
export default useAuth