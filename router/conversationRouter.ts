import express, { Express, Router, Request, Response } from "express";
import multer from "multer";
import {verifyToken} from "../middlewares/authenticate";
import {ConversationController} from "../controller/ConversationController"
const conversationRouter: Router = express.Router();
const upload=multer();

conversationRouter.post("/createGroupChat",verifyToken,upload.none(),new ConversationController().createGroupConversation);
conversationRouter.post("/createPrivateChat",verifyToken,upload.none(),new ConversationController().createPrivateConversation);
conversationRouter.post("/checkPrivateMessage",verifyToken,new ConversationController().checkPrivateConversationBetween);
conversationRouter.get("/getConversations",verifyToken,new ConversationController().getConversations)

export default conversationRouter;