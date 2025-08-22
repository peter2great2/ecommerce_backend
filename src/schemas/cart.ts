import { IUser } from "./user";
import mongoose from "mongoose";
import { IProducts } from "./products";

export interface ICartItem {
  product: IProducts["_id"];
  quantity: number;
}

export interface ICart {
  user: IUser["_id"];
  items: ICartItem[];
}

const cartSchema = new mongoose.Schema<ICart>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: { type: Number, default: 1, required: true },
    },
  ],
});

export default mongoose.model<ICart>("Cart", cartSchema);
