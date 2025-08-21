import { Router } from "express";
import { register, login } from "../controllers/authController";
import { getAll } from "../controllers/user";
const userRouter = Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/users/all", getAll);

export default userRouter;
