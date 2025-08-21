import User from "../schemas/user";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const getAll = async (req: Request, res: Response) => {
  const users = await User.find().select("-password");
  if (!users) {
    return res.status(400).json({
      message: "no registered user",
    });
  }
  res.status(200).json(users);
};
