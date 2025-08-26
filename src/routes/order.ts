import { checkOut, getAll, getUserOrders } from "../controllers/order";
import { authMiddleware } from "../middlewares/auth";
import { adminMiddleware } from "../middlewares/adminAuth";
import { Router } from "express";

const orderRouter = Router();

orderRouter.post("/checkout", authMiddleware, checkOut);
orderRouter.get("/all", adminMiddleware, getAll);
orderRouter.get("/orders", authMiddleware, getUserOrders);

export default orderRouter;
