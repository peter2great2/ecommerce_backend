import User from "../schemas/user";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

interface authRequest extends Request {
  user?: { id: string; role: string };
}

export const getAll = async (req: authRequest, res: Response) => {
  const user = await User.find().select("-password");
  if (req.user?.role == "admin") {
    return res.status(403).json({
      message: "Access denied. Admins only.",
    });
  }
  if (!user) {
    return res.status(400).json({
      message: "no registered user",
    });
  }
  res.status(200).json(user);
};

export const getProfile = async (req: authRequest, res: Response) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({
      message: "an id is needed to see profile",
    });
  }
  if (req.user?.role !== "admin" && req.user?.id !== id) {
    return res.status(400).json({ message: "you can only see your profile" });
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
    // res.clearCookie("token");
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

export const logout = async (req: Request, res: Response) => {
  try {
    await res.clearCookie("token");
    res.status(200).json({ message: "logged out successful" });
  } catch (error) {
    res.status(404).json({ message: "not logged in" });
  }
};

export const removeUser = async (req: authRequest, res: Response) => {
  const userId = await User.findById(req.params.id);
  const id = req.params.id;
  if (req.user?.role !== "admin" && req.user?.id !== id) {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  if (!userId) {
    return res.status(404).json({ message: `id not in database` });
  }
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    res.status(400).json({
      message: "invalid id",
    });
  }
  res.status(200).json({
    message: `${user?.username} has been deleted from database`,
  });
};
