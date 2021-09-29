import express, { Express, Router, Request, Response } from "express";
import multer from "multer";
import { handleChangeIconName } from "../middlewares/roomMiddlewares";
import { serverAddress } from "../common/constants";
import { IconCreateRequest, IconInfo } from "../TS/File";
import { FileControler } from "../controller/FileController";
import path from "path";
const uploadRouter: Router = express.Router();

const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, "./assets/icon");
  },

  filename: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, file.originalname);
  },
});

const iconUpload = multer({
  storage: storage,
  limits: {
    fieldSize: 20000, //TODO: Check if this size is enough
    // TODO: Change this line after compression
    fileSize: 1500000, // 150 KB for a 1080x1080 JPG 90
  },
  fileFilter: function (_req, file, cb) {
    checkIcon(file, cb);
  },
});

function checkIcon(file: Express.Multer.File, cb: any) {  
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Acepit only jpeg jpg png"));
  }
}

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

uploadRouter.get("/getIconById/:id", new FileControler().getIconById);

export default uploadRouter;
