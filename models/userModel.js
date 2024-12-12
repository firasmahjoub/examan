// userModel.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  cartData: { type: Map, of: Number, default: {} }, // `cartData` to store items and their quantities
});

export default mongoose.model("User", userSchema);