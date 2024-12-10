import express from "express";
import { loginUser,registerUser } from "../controller/userController.js";

const router = express.Router();

// Register User Route
router.post("/register", registerUser);

// Login User Route
router.post("/login", loginUser);

export default router;
