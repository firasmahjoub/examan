import express from "express";
import { addToCart, removeFromCart, getCart } from "../controller/cardController.js";
import authMiddleware from "../middleware/auth.js";

const cartRouter = express.Router();

cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.post("/remove", authMiddleware, removeFromCart);
cartRouter.get("/get/:userId", authMiddleware, getCart);

export default cartRouter;