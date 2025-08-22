import mongoose from "mongoose";
import { model, Document } from "mongoose";

export interface IProducts extends mongoose.Document {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
}
const productSchema = new mongoose.Schema<IProducts>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IProducts>("Product", productSchema);
