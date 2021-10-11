"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MessageController_1 = require("../controller/MessageController");
const express_1 = __importDefault(require("express"));
const authenticate_1 = require("../middlewares/authenticate");
const multer_1 = require("../common/multer");
const multer_2 = require("../common/multer");
const message_1 = require("../middlewares/message");
const messageRouter = express_1.default.Router();
messageRouter.post("/sendMessage", authenticate_1.verifyToken, multer_1.imageUpload.fields([
    {
        name: "singleImage",
        maxCount: 1,
    },
    {
        name: "multipleImage",
        maxCount: 100,
    },
]), multer_2.handleUploadFile, message_1.validateMessageInput, new MessageController_1.MessageController().insertNewMessage);
messageRouter.get("/getMessages", authenticate_1.verifyToken, new MessageController_1.MessageController().getMesssages);
exports.default = messageRouter;
