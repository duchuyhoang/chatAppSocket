import express, { Express, Router, Request, Response } from "express";
import { AuthenticationController } from "../controller/AuthenticationController";
import { imageUpload,handleUploadFile } from "../common/multer";
import {verifyToken} from "../middlewares/authenticate";
const authenticationRouter: Router = express.Router();
authenticationRouter.post("/login", new AuthenticationController().login);
authenticationRouter.post(
  "/signup",
  imageUpload.fields([
    {
      name: "singleImage",
      maxCount: 1,
    },
  ]),
  handleUploadFile,
  new AuthenticationController().signUp
);

// let a =new FormData();
// 1 ảnh
// a.append("singleImage",img)

// 2 ảnh
// for(let ili<n){
// a.append("multiple")

// }


authenticationRouter.post("/re_login",verifyToken, new AuthenticationController().reLogin);

authenticationRouter.post("/refresh_token", new AuthenticationController().refreshToken);

export default authenticationRouter;
