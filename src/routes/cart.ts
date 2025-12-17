import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItemQuantity,
} from "../controllers/cart";
import { authMiddleware } from "../middlewares/auth";

import { Router } from "express";

const cartRouter = Router();

cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.get("/cart", authMiddleware, getCart);
cartRouter.delete("/remove", authMiddleware, removeFromCart);
cartRouter.put("/update", authMiddleware, updateCartItemQuantity);

export default cartRouter;
