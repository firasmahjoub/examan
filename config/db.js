import mongoose from "mongoose";
export const connectDb = async()=>{
    await mongoose.connect('mongodb+srv://admin:firas12345@cluster0.jjeiu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(()=>console.log('data connected'))
}