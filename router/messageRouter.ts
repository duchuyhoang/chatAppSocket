import { MessageController } from "../controller/MessageController";
import express from "express";
import multer from "multer";
import { verifyToken } from "../middlewares/authenticate";
import { imageUpload } from "../common/multer";
import {handleUploadFile} from "../common/multer";
const messageRouter = express.Router();

messageRouter.post(
  "/sendMessage",
  verifyToken,
  imageUpload.fields([
    {
      name: "singleImage",
      maxCount: 1,
    },
    {
      name: "multipleImage",
      maxCount: 100,
    },
  ]),
  handleUploadFile,
new MessageController().insertNewMessage
);
export default messageRouter;