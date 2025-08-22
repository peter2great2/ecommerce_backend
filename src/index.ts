import express, { Application } from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import userRouter from "./routes/user";
import cookieParser from "cookie-parser";
import productRouter from "./routes/products";
import cartRouter from "./routes/cart";

const app: Application = express();
const port = process.env.PORT || 3000;
const mongoUrl =
  (process.env.MONGO_URL as string) || "mongodb://127.0.0.1:27017/shopify-app";

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", userRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  mongoose
    .connect(mongoUrl)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
    });
});
