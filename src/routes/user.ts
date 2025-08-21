import { Router } from "express";
import { register, login } from "../controllers/authController";
import {
  getAll,
  getProfile,
  updateUser,
  logout,
  removeUser,
} from "../controllers/user";
const userRouter = Router();
import { authMiddleware } from "../middlewares/auth";
import { adminMiddleware } from "../middlewares/adminAuth";

// admin routes
userRouter.get("/users/all", adminMiddleware, getAll);
userRouter.delete("/user/remove/:id", authMiddleware, removeUser);

// user routes

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/profile/:id", authMiddleware, getProfile);
userRouter.put("/update/:id", updateUser);
userRouter.post("/user/logout", logout);

export default userRouter;
