"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const NotificationController_1 = require("../controller/NotificationController");
const authenticate_1 = require("../middlewares/authenticate");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const notificationRouter = express_1.default.Router();
notificationRouter.post("/insertNewFriendRequest", authenticate_1.verifyToken, upload.none(), new NotificationController_1.NotificationController().insertNewNotification);
notificationRouter.get("/getAllNotification", authenticate_1.verifyToken, upload.none(), new NotificationController_1.NotificationController().getAllNotificationByUser);
notificationRouter.get("/getNotification/:id", authenticate_1.verifyToken, new NotificationController_1.NotificationController().getConversationById);
notificationRouter.post("/answerFriendRequest", authenticate_1.verifyToken, new NotificationController_1.NotificationController().answerFriendRequest);
exports.default = notificationRouter;
