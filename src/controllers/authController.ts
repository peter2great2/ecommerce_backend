import User from "../schemas/user";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  const { email, password, username, role, firstName, lastName } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      username,
      firstName,
      lastName,
      // picture: undefined,
      role,
    });
    await user.save();
    res.status(201).json({
      message: `congratulations ${user?.username}, your registration is successful`,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "not yet registered",
    });
  }
  try {
    const verifyPass = await bcrypt.compare(password, user.password);
    if (!verifyPass) {
      return res.status(400).json({
        message: "wrong password",
      });
    }
    let generateToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );
    res.cookie("token", generateToken);
    res.status(200).json({
      message: "successful",
      token: generateToken,
    });
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
};
