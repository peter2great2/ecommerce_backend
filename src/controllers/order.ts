import Cart from "../schemas/cart";
import Product from "../schemas/products";
import User from "../schemas/user";
import { Request, Response } from "express";
import Order from "../schemas/order";

interface AuthRequest extends Request {
  user?: { id: string };
}
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
