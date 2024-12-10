import mongoose from "mongoose";

//schema of the food 

const foodSchema = new mongoose.Schema({
    name:{type:String , required: true},
    description:{type:String , required: true},
    price:{type:Number , required: true},
    Image:{type:String , required: true},
    category:{type:String , required: true}
})
// create the food model if thoes not exist 
const foodModel = mongoose.models.food || mongoose.model("food",foodSchema)
export default foodModel; 