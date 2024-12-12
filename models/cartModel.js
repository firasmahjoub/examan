// cartModel.js
import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
    name: { type: String, required: true },
    image: { 
        type: String, 
        required: false, // Make image optional
        default: "default_image_url" // Optional: Set a default image URL here
    }
});

const Cart = mongoose.models.cart || mongoose.model("Cart", cartSchema);
export default Cart;
