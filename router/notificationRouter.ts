import express from "express";
import { NotificationController } from "../controller/NotificationController";
import { verifyToken } from "../middlewares/authenticate";
const notificationRouter = express.Router();


notificationRouter.post("/insertNewFriendRequest",verifyToken,new NotificationController().insertNewNotification);
notificationRouter.get("/getAllNotification",verifyToken,new NotificationController().getAllNotificationByUser);
notificationRouter.get("/getNotification/:id",verifyToken,new NotificationController().getConversationById);
notificationRouter.post("/answerFriendRequest",verifyToken,new NotificationController().answerFriendRequest);

export default notificationRouter;