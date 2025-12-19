"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("./routes/user"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const products_1 = __importDefault(require("./routes/products"));
const cart_1 = __importDefault(require("./routes/cart"));
const order_1 = __importDefault(require("./routes/order"));
const payment_1 = __importDefault(require("./routes/payment"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/shopify-app";
app.use((0, cors_1.default)({ origin: "http://localhost:5173", credentials: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/auth", user_1.default);
app.use("/api/products", products_1.default);
app.use("/api/cart", cart_1.default);
app.use("/api/order", order_1.default);
app.use("/api/payment", payment_1.default);
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
