import User from "../schemas/user";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

export const getAll = async (req: Request, res: Response) => {
  const users = await User.find().select("-password");
  if (!users) {
    return res.status(400).json({
      message: "no registered user",
    });
  }
  res.status(200).json(users);
};

export const getProfile = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({
      message: "an id is needed to see profile",
    });
  }
  try {
    const profile = await User.findById(id).select("-password");
    res.status(200).json(profile);
  } catch (error) {
    res.status(400).json({
      message: "an error occur",
    });
  }
};
export const updateUser = async (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;
  try {
    const hashPass = await bcrypt.hash(password, 10);
    const editUser = await User.findByIdAndUpdate(req.params.id, {
      username,
      email,
      password: hashPass,
      role,
    });
    if (!editUser) {
      res.status(400).json({
        message: "unable to update information",
      });
    }
    res.status(200).json({
      message: "update is successful",
    });
  } catch (error) {
    res.status(400).json({
      message: "unable to update information",
    });
  }
};
