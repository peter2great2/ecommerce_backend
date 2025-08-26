import Cart from "../schemas/cart";
import { Request, Response } from "express";
import Order from "../schemas/order";
import { AuthRequest } from "../middlewares/auth";

export const checkOut = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(400).json({ message: "Unauthorized" });
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length == 0)
      return res.status(400).json({ message: "Your cart is empty" });
    let total = 0;
    let orderItems: any[] = [];
    for (const item of cart.items) {
      const product: any = item.product;

      // ✅ Stock check
      if (item.quantity > product.stock) {
        return res
          .status(400)
          .json({ error: `Not enough stock for ${product.name}` });
      }

      // Deduct stock
      product.stock -= item.quantity;
      await product.save();

      orderItems.push({ product: product._id, quantity: item.quantity });
      total += product.price * item.quantity;
    }
    const order = new Order({
      user: userId,
      items: orderItems.map((item: any) => item),
      total,
      status: "Pending",
    });
    await order.save();
    cart.items = [];
    await cart.save();
    res.status(200).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(400).json({ message: "server error", error: error });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const totalOrders = await Order.find().countDocuments();
    const allOrders = await Order.find()
      .populate("user", "username email")
      .select("-_id")
      .populate("items.product")
      .select("-_id");
    if (!allOrders)
      return res.status(400).json({
        message: "NO ORDERS",
      });
    return res.status(200).json({
      totalOrders: totalOrders,
      orders: allOrders,
    });
  } catch (error) {
    res.status(500).json({
      message: "server error",
      error: error,
    });
  }
};

export const getUserOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const noOfOrders = await Order.find().countDocuments();
    const myOrders = await Order.find({ user: userId }).populate(
      "items.product"
    );
    res.status(200).json({
      totalOrders: noOfOrders,
      orders: myOrders,
    });
  } catch (error) {
    res.status(500).json({
      message: "server error",
      error: error,
    });
  }
};

export const updateStatus = async (req: AuthRequest, res: Response) => {
  try {
    const status = req.body.status;
    const orderId = req.params.id;
    const update = await Order.findByIdAndUpdate(orderId, { status: status });
    if (!update) {
      res.status(400).json({
        message: "the status failed to update",
      });
    }
    res.status(200).json({
      message: `item ${req.body.status}`,
    });
  } catch (error) {
    res.status(500).json({
      message: "server error",
      error: error,
    });
  }
};
