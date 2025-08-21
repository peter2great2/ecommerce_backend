import { Router } from "express";
import { register, login } from "../controllers/authController";
import { getAll, getProfile, updateUser } from "../controllers/user";
const userRouter = Router();
import { authMiddleware } from "../middlewares/auth";

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/users/all", authMiddleware, getAll);
userRouter.get("/profile/:id", authMiddleware, getProfile);
userRouter.put("/update/:id", updateUser);

export default userRouter;
