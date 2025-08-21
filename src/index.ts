import express, { Application } from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import UserSchema from "./schemas/UserSchema";
import userRouter from "./routes/user";

const app: Application = express();
const port = process.env.PORT || 3000;
const mongoUrl =
  (process.env.MONGO_URL as string) || "mongodb://127.0.0.1:27017/shopify-app";

app.use(express.json());
app.use("/api/auth", userRouter);

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
