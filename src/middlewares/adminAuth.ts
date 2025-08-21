import { Request, Response, NextFunction } from "express";
import User from "../schemas/user";
import jwt from "jsonwebtoken";
interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const adminMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const decoded = (await jwt.verify(req.cookies.token, "SECRET")) as {
    id: string;
  };
  const user = await User.findById(decoded.id);
  if (user?.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};
