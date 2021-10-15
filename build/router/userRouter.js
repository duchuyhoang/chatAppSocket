"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_1 = require("../middlewares/authenticate");
const UserController_1 = require("../controller/UserController");
const multer_1 = require("../common/multer");
const userRouter = express_1.default.Router();
userRouter.get("/friendList", authenticate_1.verifyToken, new UserController_1.UserController().getUserFriend);
userRouter.get("/searchUser", authenticate_1.verifyToken, new UserController_1.UserController().searchUserByEmailOrPhone);
userRouter.get("/getListFriend", authenticate_1.verifyToken, new UserController_1.UserController().getUserFriend);
userRouter.get("/checkRelationshipBetween", authenticate_1.verifyToken, new UserController_1.UserController().viewRelationshipStatus);
userRouter.post("/editUser", authenticate_1.verifyToken, multer_1.imageUpload.fields([
    {
        name: "singleImage",
        maxCount: 1,
    },
]), multer_1.handleUploadFile, new UserController_1.UserController().editUser);
exports.default = userRouter;
