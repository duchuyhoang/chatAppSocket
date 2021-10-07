import express, { Express, Router, Request, Response } from "express";
import {verifyToken} from "../middlewares/authenticate";
import {UserController} from "../controller/UserController";
const userRouter=express.Router();

userRouter.get("/friendList",verifyToken,new UserController().getUserFriend);
userRouter.get("/searchUser",verifyToken, new UserController().searchUserByEmailOrPhone);

export default userRouter;
