import express from "express";
import { NotificationController } from "../controller/NotificationController";
import { verifyToken } from "../middlewares/authenticate";
import multer from "multer";
const upload=multer();

const notificationRouter = express.Router();


notificationRouter.post("/insertNewFriendRequest",verifyToken,upload.none(),new NotificationController().insertNewNotification);
notificationRouter.get("/getAllNotification",verifyToken,upload.none(),new NotificationController().getAllNotificationByUser);
notificationRouter.get("/getNotification/:id",verifyToken,new NotificationController().getConversationById);
notificationRouter.post("/answerFriendRequest",verifyToken,new NotificationController().answerFriendRequest);

export default notificationRouter;