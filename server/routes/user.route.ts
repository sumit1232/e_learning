import express  from "express";
import { registationUser } from "../controllers/user.controller";
const userRouter  = express.Router();

userRouter.post("/register", registationUser);
export default userRouter;