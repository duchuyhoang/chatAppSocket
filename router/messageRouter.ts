import { MessageController } from "../controller/MessageController";
import express from "express";
import multer from "multer";
import { verifyToken } from "../middlewares/authenticate";
import { imageUpload } from "../common/multer";
import { handleUploadFile } from "../common/multer";
import { validateMessageInput } from "../middlewares/message";
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
  validateMessageInput,
  new MessageController().insertNewMessage
);

messageRouter.get("/getMessages",verifyToken,new MessageController().getMesssages);


export default messageRouter;
