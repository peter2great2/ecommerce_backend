import mongoose, { model, Schema } from "mongoose";
import { Document } from "mongoose";

export interface IOrderItem {
  product: Schema.Types.ObjectId;
  quantity: number;
}

export interface IOrder {
  user: Schema.Types.ObjectId;
  items: IOrderItem[];
  total: number;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled" | "Paid";
  createdAt: Date;
}

const orderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Pending", "Shipped", "Delivered", "Cancelled", "Paid"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export default model<IOrder>("Order", orderSchema);
