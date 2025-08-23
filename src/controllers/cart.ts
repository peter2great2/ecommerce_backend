import Cart from "../schemas/cart";
import Products from "../schemas/products";
import { Request, Response } from "express";

interface AuthRequest extends Request {
  user?: { id: string };
}

export const addToCart = async (req: AuthRequest, res: Response) => {
  const { productId, quantity } = req.body;
  if (!productId || !quantity) {
    return res
      .status(400)
      .json({ message: "productId and quantity are required" });
  }
  const product = await Products.findById(productId);
  const inStock = product?.stock as number;
  if (!product) {
    return res.status(400).json({ message: "product not found" });
  }
  let cart = await Cart.findOne({ user: req.user?.id });
  if (!cart) {
    cart = new Cart({ user: req.user?.id, items: [] });
  }
  // Check if product already in cart
  const itemIndex = cart.items.findIndex(
    (item: any) => item.product.toString() === productId
  );
  if (quantity > inStock) {
    return res.status(400).json({ message: "not enough stock to proceed" });
  }
  if (itemIndex > -1) {
    // Update quantity
    cart.items[itemIndex].quantity += quantity;
  } else {
    // Add new item
    cart.items.push({ product: productId, quantity });
  }
  await cart.save();
  res.status(200).json({ message: "Product added to cart", cart });
};

export const getCart = async (req: AuthRequest, res: Response) => {
  const cart = await Cart.findOne({ user: req.user?.id }).populate(
    "items.product"
  );
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }
  res.status(200).json({ cart });
};

export const removeFromCart = async (req: AuthRequest, res: Response) => {
  const { productId } = req.body;
  if (!productId) {
    return res.status(400).json({ message: "productId is required" });
  }
  const cart = await Cart.findOne({ user: req.user?.id });
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }
  const itemIndex = cart.items.findIndex(
    (item: any) => item.product.toString() === productId
  );
  if (itemIndex === -1) {
    return res.status(404).json({ message: "Item not found in cart" });
  }
  cart.items.splice(itemIndex, 1);
  await cart.save();
  res.status(200).json({ message: "Item removed from cart", cart });
};
