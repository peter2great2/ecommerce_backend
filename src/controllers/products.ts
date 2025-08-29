import mongoose from "mongoose";
import { Request, Response } from "express";
import Product from "../schemas/products";

export const createProduct = async (req: Request, res: Response) => {
  const { name, stock, description, category, price } = req.body;
  try {
    const newProduct = new Product({
      name,
      stock,
      description,
      category,
      price,
    });
    await newProduct.save();
    res.status(200).json({
      message: `${name} has been created successfully`,
      created: newProduct,
    });
  } catch (error) {
    res.status(400).json({ message: "an error occur" });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  const productId = req.params.id;
  try {
    const findProduct = await Product.findById(productId);
    if (!findProduct) {
      return res.status(404).json({
        message: `no product found with this id ${productId}`,
      });
    }
    res.status(200).json({
      findProduct,
    });
  } catch (error) {
    res.status(400).json({
      message: "server error",
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(400).json({
        message: `no product found in the database with this id ${req.params.id}`,
      });
    }
    res.status(200).json({
      message: `${product?.name} has been deleted from the database`,
    });
  } catch (error) {
    res.status(400).json({
      message: "an error occur trying to delete",
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { name, category, price, stock, description } = req.body;
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { name, category, description, price, stock },
      { new: true }
    );
    if (!updated) {
      return res.status(400).json({
        message: "error trying to update",
      });
    }
    res.status(200).json({
      message: "product has been updated successfully",
      updated,
    });
  } catch (error) {
    res.status(400).json({
      message: "server error",
    });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const all = await Product.find();
    const productCount = await Product.countDocuments();
    res.status(200).json({
      total: productCount,
      products: all,
    });
  } catch (error) {
    res.status(400).json({
      message: "server error",
    });
  }
};
