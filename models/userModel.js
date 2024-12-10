import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },  // New field
  verificationToken: { type: String },  // New field
});

export default mongoose.model("User", userSchema);
