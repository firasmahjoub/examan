import express from "express";
import { addToCart, removeFromCart, getCart } from "../controller/cardController.js";
import authMiddleware from "../middleware/auth.js";

const cartRouter = express.Router();

// Add item to cart
cartRouter.post("/add", authMiddleware, addToCart);

// Remove item from cart
cartRouter.delete("/remove", authMiddleware, removeFromCart);

// Get cart items for the authenticated user
cartRouter.get("/get/:userId", authMiddleware, (req, res, next) => {
  // Validate that the requested userId matches the authenticated user
  if (req.params.userId !== req.user.userId) {
    return res.status(403).json({ success: false, message: "Unauthorized access to this cart" });
  }
  next();
}, getCart);

export default cartRouter;
