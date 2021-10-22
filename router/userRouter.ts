import express, { Express, Router, Request, Response } from "express";
import { verifyToken } from "../middlewares/authenticate";
import { UserController } from "../controller/UserController";
import { handleUploadFile, imageUpload } from "../common/multer";
const userRouter = express.Router();

userRouter.get("/friendList", verifyToken, new UserController().getUserFriend);
userRouter.get(
  "/searchUser",
  verifyToken,
  new UserController().searchUserByEmailOrPhone
);
userRouter.get(
  "/getListFriend",
  verifyToken,
  new UserController().getUserFriend
);

userRouter.get(
  "/checkRelationshipBetween/:id_friend",
  verifyToken,
  new UserController().viewRelationshipStatus
);
userRouter.post(
  "/editUser",
  verifyToken,
  imageUpload.fields([
    {
      name: "singleImage",
      maxCount: 1,
    },
  ]),
  handleUploadFile,
  new UserController().editUser
);

userRouter.get("/getUserById/:id",verifyToken,new UserController().getUserById);


export default userRouter;
