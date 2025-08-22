import express from "express";
import { addToCart, getCart } from "../controllers/cart";
import { authMiddleware } from "../middlewares/auth";

import { Router } from "express";

const cartRouter = Router();

cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.get("/cart", authMiddleware, getCart);

export default cartRouter;
