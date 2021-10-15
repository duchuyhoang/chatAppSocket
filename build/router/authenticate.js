"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthenticationController_1 = require("../controller/AuthenticationController");
const multer_1 = require("../common/multer");
const authenticate_1 = require("../middlewares/authenticate");
const authenticationRouter = express_1.default.Router();
authenticationRouter.post("/login", new AuthenticationController_1.AuthenticationController().login);
authenticationRouter.post("/signup", multer_1.imageUpload.fields([
    {
        name: "singleImage",
        maxCount: 1,
    },
]), multer_1.handleUploadFile, new AuthenticationController_1.AuthenticationController().signUp);
// let a =new FormData();
// 1 ảnh
// a.append("singleImage",img)
// 2 ảnh
// for(let ili<n){
// a.append("multiple")
// }
authenticationRouter.post("/re_login", authenticate_1.verifyToken, new AuthenticationController_1.AuthenticationController().reLogin);
authenticationRouter.post("/refresh_token", new AuthenticationController_1.AuthenticationController().refreshToken);
exports.default = authenticationRouter;
