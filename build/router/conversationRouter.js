"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const authenticate_1 = require("../middlewares/authenticate");
const ConversationController_1 = require("../controller/ConversationController");
const conversationRouter = express_1.default.Router();
const upload = (0, multer_1.default)();
conversationRouter.post("/createGroupChat", authenticate_1.verifyToken, upload.none(), new ConversationController_1.ConversationController().createGroupConversation);
conversationRouter.post("/createPrivateChat", authenticate_1.verifyToken, upload.none(), new ConversationController_1.ConversationController().createPrivateConversation);
conversationRouter.post("/checkPrivateMessage", authenticate_1.verifyToken, new ConversationController_1.ConversationController().checkPrivateConversationBetween);
exports.default = conversationRouter;
