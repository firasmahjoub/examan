import express from "express";
import { addToCart, removeFromCard, getCart } from "../controller/cardController.js";
import authMiddleware from "../middleware/auth.js";

const cardRouter = express.Router(); 
cardRouter.post("/add", authMiddleware,addToCart);
cardRouter.post("/remove", authMiddleware,removeFromCard);
cardRouter.post("/get",authMiddleware, getCart);


export default cardRouter;
