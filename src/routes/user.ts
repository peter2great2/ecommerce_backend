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

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/users/all", adminMiddleware, getAll);
userRouter.get("/profile/:id", authMiddleware, getProfile);
userRouter.put("/update/:id", updateUser);
userRouter.post("/user/logout", logout);
userRouter.delete("/user/remove/:id", removeUser);

export default userRouter;
