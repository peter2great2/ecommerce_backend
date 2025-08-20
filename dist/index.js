"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/shopify-app";
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    mongoose_1.default
        .connect(mongoUrl)
        .then(() => {
        console.log("Connected to MongoDB");
    })
        .catch((error) => {
        console.error("MongoDB connection error:", error);
    });
});
