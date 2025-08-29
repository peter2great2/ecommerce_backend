import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth";
import Order from "../schemas/order";
import flutterwaveService from "../payments/flutterwaveService";
import { v4 as uuidv4 } from "uuid";

/**
 * Initialize payment for an order
 */
export const initializePayment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) return res.status(400).json({ message: "Unauthorized" });

    const { orderId, paymentMethod = "flutterwave" } = req.body;
    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }
    // Find the order first without populating to check ownership
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    // Check if order belongs to user
    if (order.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized access to order" });
    }
    // Now populate user for payment data
    await order.populate("user");
    // Check if payment is already successful
    if (order.paymentInfo && order.paymentInfo.paymentStatus === "successful") {
      return res.status(400).json({ message: "Order is already paid" });
    }

    // Generate unique transaction reference
    const tx_ref = `shop_app_${orderId}_${uuidv4()}`;
    // Get user details
    const user: any = order.user;

    // Prepare payment data
    const paymentData = {
      amount: order.total,
      currency: "NGN", // Change to your preferred currency
      email: user.email,
      phone_number: user.phone || "",
      name: user.username || user.email,
      tx_ref: tx_ref,
      redirect_url: `${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/payment/callback`,
      customer_id: userId,
      customizations: {
        title: "Shop App Payment",
        description: `Payment for Order #${orderId}`,
      },
    };

    // Initialize payment with Flutterwave
    const paymentResponse = await flutterwaveService.generatePaymentLink(
      paymentData
    );

    if (paymentResponse.status === "success") {
      // Update order with payment information
      order.paymentInfo.transactionId = tx_ref;
      order.paymentInfo.paymentMethod = paymentMethod;
      order.paymentInfo.paymentStatus = "successful";
      await order.save();
      res.status(200).json({
        message: "Payment initialized successfully",
        data: {
          payment_link: paymentResponse.data.link,
          tx_ref: tx_ref,
          orderId: orderId,
        },
      });
    } else {
      res.status(400).json({
        message: "Failed to initialize payment",
        error: paymentResponse.message,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      message: "Server error during payment initialization",
      error: error.message || error,
    });
  }
};

/**
 * Verify payment after callback
 */
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { transaction_id, tx_ref } = req.query;

    if (!transaction_id || !tx_ref) {
      return res.status(400).json({
        message: "Transaction ID and reference are required",
      });
    }

    // Verify payment with Flutterwave
    const verificationResponse = await flutterwaveService.verifyPayment(
      transaction_id as string
    );

    if (verificationResponse.status === "success") {
      const paymentData = verificationResponse.data;

      // Find the order using transaction reference
      const order = await Order.findOne({
        "paymentInfo.transactionId": tx_ref,
      });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Verify amount matches
      if (paymentData.amount !== order.total) {
        return res.status(400).json({
          message: "Payment amount mismatch",
        });
      }

      // Update order payment status
      if (paymentData.status === "successful") {
        order.paymentInfo.paymentStatus = "successful";
        order.paymentInfo.flutterwaveRef = paymentData.flw_ref;
        order.paymentInfo.paidAt = new Date();
        order.status = "Paid";
        await order.save();

        res.status(200).json({
          message: "Payment verified successfully",
          data: {
            orderId: order._id,
            amount: paymentData.amount,
            status: "successful",
          },
        });
      } else {
        order.paymentInfo.paymentStatus = "failed";
        await order.save();

        res.status(400).json({
          message: "Payment verification failed",
          status: paymentData.status,
        });
      }
    } else {
      res.status(400).json({
        message: "Payment verification failed",
        error: verificationResponse.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Server error during payment verification",
      error: error,
    });
  }
};

/**
 * Handle Flutterwave webhook
 */
export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;
    const signature = req.headers["verif-hash"];

    if (!signature || signature !== secretHash) {
      return res.status(401).json({ message: "Unauthorized webhook" });
    }

    const payload = req.body;

    // Handle successful payment
    if (
      payload.event === "charge.completed" &&
      payload.data.status === "successful"
    ) {
      const { tx_ref, amount, flw_ref } = payload.data;

      // Find the order
      const order = await Order.findOne({
        "paymentInfo.transactionId": tx_ref,
      });

      if (order && order.paymentInfo.paymentStatus === "pending") {
        // Verify amount matches
        if (amount === order.total) {
          order.paymentInfo.paymentStatus = "successful";
          order.paymentInfo.flutterwaveRef = flw_ref;
          order.paymentInfo.paidAt = new Date();
          order.status = "Paid";
          await order.save();
        } else {
          res.status(400).json({ message: "Payment amount mismatch" });
        }
      }
    }

    res.status(200).json({ status: "ok" });
  } catch (error) {
    res.status(500).json({ message: "Webhook processing error" });
  }
};

/**
 * Get payment status for an order
 */
export const getPaymentStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { orderId } = req.params;

    if (!userId) return res.status(400).json({ message: "Unauthorized" });

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if order belongs to user
    if (order.user.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized access to order" });
    }

    res.status(200).json({
      orderId: order._id,
      paymentStatus: order.paymentInfo.paymentStatus,
      paymentMethod: order.paymentInfo.paymentMethod,
      transactionId: order.paymentInfo.transactionId,
      amount: order.paymentInfo.amount,
      paidAt: order.paymentInfo.paidAt,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error,
    });
  }
};

/**
 * Refund a payment
 */
export const refundPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;
    const { amount } = req.body; // Optional partial refund amount

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if already refunded
    if (order.paymentInfo.paymentStatus === "refunded") {
      return res.status(400).json({ message: "Order is already refunded" });
    }

    // Check if payment is successful
    if (order.paymentInfo.paymentStatus !== "successful") {
      return res.status(400).json({ message: "Cannot refund unpaid order" });
    }

    if (!order.paymentInfo.flutterwaveRef) {
      return res
        .status(400)
        .json({ message: "No Flutterwave reference found" });
    }

    // Process refund with Flutterwave
    const refundResponse = await flutterwaveService.refundTransaction(
      order.paymentInfo.flutterwaveRef,
      amount
    );

    if (refundResponse.status === "success") {
      order.paymentInfo.paymentStatus = "refunded";
      order.status = "Cancelled";
      await order.save();

      res.status(200).json({
        message: "Refund processed successfully",
        data: refundResponse.data,
      });
    } else {
      res.status(400).json({
        message: "Refund processing failed",
        error: refundResponse.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Server error during refund processing",
      error: error,
    });
  }
};
