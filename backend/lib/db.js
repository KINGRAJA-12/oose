import mongoose from "mongoose";


export const connectDb=async()=>{
    try{
        let connect=await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("data base connected successfully")
    }catch(err){
        console.log(err?.message||"something went wrong");
    }
}
