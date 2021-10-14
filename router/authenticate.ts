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
authenticationRouter.post("/re_login",verifyToken, new AuthenticationController().reLogin);

authenticationRouter.post("/refresh_token", new AuthenticationController().refreshToken);

export default authenticationRouter;
