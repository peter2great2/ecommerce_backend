import mongoose, { model, Schema } from "mongoose";
import { Document } from "mongoose";

export interface IOrderItem {
  product: Schema.Types.ObjectId;
  quantity: number;
}

export interface IPaymentInfo {
  paymentMethod: "flutterwave" | "cash" | "bank_transfer";
  transactionId?: string;
  flutterwaveRef?: string;
  paymentStatus: "pending" | "successful" | "failed" | "refunded";
  paidAt?: Date;
  amount: number;
}

export interface IOrder {
  user: Schema.Types.ObjectId;
  items: IOrderItem[];
  total: number;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled" | "Paid";
  paymentInfo: IPaymentInfo;
  createdAt: Date;
}

const paymentInfoSchema = new Schema<IPaymentInfo>({
  paymentMethod: {
    type: String,
    enum: ["flutterwave", "cash", "bank_transfer"],
    required: true,
    default: "flutterwave",
  },
  transactionId: { type: String },
  flutterwaveRef: { type: String },
  paymentStatus: {
    type: String,
    enum: ["pending", "successful", "failed", "refunded"],
    default: "pending",
  },
  paidAt: { type: Date },
  amount: { type: Number, required: true },
});

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
  paymentInfo: { type: paymentInfoSchema, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default model<IOrder>("Order", orderSchema);
