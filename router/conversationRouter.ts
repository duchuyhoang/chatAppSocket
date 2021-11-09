import express, { Express, Router, Request, Response } from "express";
import multer from "multer";
import {verifyToken} from "../middlewares/authenticate";
import {ConversationController} from "../controller/ConversationController";
import { checkUserExist } from "../middlewares/roomMiddlewares";

const conversationRouter: Router = express.Router();
const upload=multer();

conversationRouter.post("/createGroupChat",verifyToken,upload.none(),new ConversationController().createGroupConversation);
conversationRouter.post("/createPrivateChat",verifyToken,upload.none(),new ConversationController().createPrivateConversation);
conversationRouter.post("/checkPrivateMessage",verifyToken,new ConversationController().checkPrivateConversationBetween);
conversationRouter.get("/getConversations",verifyToken,new ConversationController().getConversations)
conversationRouter.get("/getSpecificConversation/:id_conversation",verifyToken,checkUserExist,new ConversationController().getConversationById);
conversationRouter.post("/addUsersToConversation",verifyToken,new ConversationController().addUsersToConversation)
export default conversationRouter;


