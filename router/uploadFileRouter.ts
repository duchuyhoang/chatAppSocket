import express, { Express, Router, Request, Response } from "express";
import multer from "multer";
import { handleChangeIconName } from "../middlewares/roomMiddlewares";
import { serverAddress } from "../common/constants";
import { IconCreateRequest, IconInfo } from "../TS/File";
import { FileControler } from "../controller/FileController";
import {iconUpload} from "../common/multer";
import path from "path";
import { verifyToken } from "../middlewares/authenticate";
const uploadRouter: Router = express.Router();

// const storage = multer.diskStorage({
//   destination: function (req: Request, file: Express.Multer.File, cb) {
//     cb(null, "./assets/icon");
//   },

//   filename: function (req: Request, file: Express.Multer.File, cb) {
//     cb(null, file.originalname);
//   },
// });


uploadRouter.post(
  "/iconCreate",
 
  iconUpload.fields([
    {
      name: "singleImage",
      maxCount: 1,
    },
  ]),
  handleChangeIconName,
  new FileControler().validateIcon,
  new FileControler().insertIcon
);

uploadRouter.get("/getIconById/:id",verifyToken, new FileControler().getIconById);
uploadRouter.get("/getIconCategory",verifyToken, new FileControler().getListIconCategory);
uploadRouter.get("/getIconByCategory/:id",verifyToken,new FileControler().getIconByCategory)


export default uploadRouter;
