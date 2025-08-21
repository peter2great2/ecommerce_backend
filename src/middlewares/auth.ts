import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, "SECRET") as { id: string; role: string };
    req.user = { id: decoded.id, role: decoded.role };
    next();
    if (!decoded) {
      return res.status(400).json({ message: "Token is not valid" });
    }
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
