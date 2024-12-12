import express from "express";
import jwt from "jsonwebtoken";

const testRouter = express.Router();

testRouter.get("/generate-token", (req, res) => {
    const userId = "test_user_id"; // Replace with real user ID during login
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log("Generated Token:", token); // Log to verify the token
    res.json({ token });
});

export default testRouter;
