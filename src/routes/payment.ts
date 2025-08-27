import { Router } from "express";
import {
  initializePayment,
  verifyPayment,
  handleWebhook,
  getPaymentStatus,
  refundPayment,
} from "../controllers/paymentController";
import { authMiddleware } from "../middlewares/auth";
import { adminMiddleware } from "../middlewares/adminAuth";

const paymentRouter = Router();

// Test endpoint to check if payment routes are working
paymentRouter.get("/test", (req, res) => {
  res.status(200).json({
    message: "Payment routes are working",
    flutterwaveKeys: {
      publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY ? "Set" : "Not set",
      secretKey: process.env.FLUTTERWAVE_SECRET_KEY ? "Set" : "Not set",
    },
  });
});

// Initialize payment for an order
paymentRouter.post("/initialize", authMiddleware, initializePayment);

// Verify payment (called after payment callback)
paymentRouter.get("/verify", verifyPayment);

// Get payment status for an order
paymentRouter.get("/status/:orderId", authMiddleware, getPaymentStatus);

// Handle Flutterwave webhook
paymentRouter.post("/webhook", handleWebhook);

// Refund payment (admin only)
paymentRouter.post("/refund/:orderId", adminMiddleware, refundPayment);

export default paymentRouter;
