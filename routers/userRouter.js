import express from "express";
import { registerUser, loginUser, verifyEmail } from "../controller/userController.js";

const router = express.Router();

// Register User Route
router.post("/register", registerUser);

// Login User Route
router.post("/login", loginUser);

// Email Verification Route
router.get("/verify-email/:token", verifyEmail);

export default router;
