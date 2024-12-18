import express from "express";
import cors from "cors";
import { connectDb } from "./config/db.js";
import userRouter from "./routers/userRouter.js";
import cartRouter from "./routers/cardRouter.js";
import testRouter from "./routers/testRouter.js";
import foodRouter from './routers/foodRouter.js'; 
import dotenv from "dotenv";
const app = express(); 
const port = 4000;

// Middleware
app.use(express.json());
app.use(cors());

// DB Connect1
connectDb();
dotenv.config(); 


app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/test", testRouter);
app.use("/api/food", foodRouter);

// Root Route
app.get("/", (req, res) => {
  res.send("API WORKING");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
