import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true, default: "default_image_url" },
    category: { type: String, required: true }
});

const Food = mongoose.models.food || mongoose.model("Food", foodSchema);
export default Food;