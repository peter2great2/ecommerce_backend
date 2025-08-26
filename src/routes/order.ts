import { checkOut } from "../controllers/order";
import { authMiddleware } from "../middlewares/auth";
import { Router } from "express";

const orderRouter = Router();

orderRouter.post("/checkout", authMiddleware, checkOut);

export default orderRouter;
