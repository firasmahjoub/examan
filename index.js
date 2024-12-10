import express from "express";
import cors from "cors";
import { connectDb } from "./config/db.js";
import foodRouter from "./routers/foodRouter.js";
import userRouter from "./routers/userRouter.js";
import 'dotenv/config.js'
import cardRouter from "./routers/cardRouter.js";
import authMiddleware from "./middleware/auth.js";
// App config:
const app = express(); 
const port = 4000;

// Middleware:
app.use(express.json());
app.use(cors());

//DBconnect
connectDb();

//api 

app.use("/api/food",foodRouter);


//bich intal3aha fil front 
app.use("/image",express.static('uploads'))

app.use("/api/user",userRouter)

app.use("/api/cart",cardRouter)

// Route:
app.get("/", (req, res) => {
  res.send("API WORKING");
});

// Start the server:
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
