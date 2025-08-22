import { Express, Router } from "express";
import { adminMiddleware } from "../middlewares/adminAuth";
import {
  createProduct,
  getProduct,
  deleteProduct,
  updateProduct,
  getAll,
} from "../controllers/products";

const productRouter = Router();

// admin routes
productRouter.delete("/remove/:id", adminMiddleware, deleteProduct);
productRouter.put("/update/:id", adminMiddleware, updateProduct);
productRouter.post("/new", adminMiddleware, createProduct);

// all users route
productRouter.get("/find/:id", getProduct);
productRouter.get("/all", getAll);

export default productRouter;
