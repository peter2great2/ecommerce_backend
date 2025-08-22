import express from "express";
import { addToCart } from "../controllers/cart";
import { authMiddleware } from "../middlewares/auth";

import { Router } from "express";

const cartRouter = Router();

cartRouter.post("/add", authMiddleware, addToCart);

export default cartRouter;
