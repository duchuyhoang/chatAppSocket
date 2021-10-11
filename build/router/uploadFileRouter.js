"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const roomMiddlewares_1 = require("../middlewares/roomMiddlewares");
const FileController_1 = require("../controller/FileController");
const multer_1 = require("../common/multer");
const uploadRouter = express_1.default.Router();
// const storage = multer.diskStorage({
//   destination: function (req: Request, file: Express.Multer.File, cb) {
//     cb(null, "./assets/icon");
//   },
//   filename: function (req: Request, file: Express.Multer.File, cb) {
//     cb(null, file.originalname);
//   },
// });
uploadRouter.post("/iconCreate", multer_1.iconUpload.fields([
    {
        name: "singleImage",
        maxCount: 1,
    },
]), roomMiddlewares_1.handleChangeIconName, new FileController_1.FileControler().validateIcon, new FileController_1.FileControler().insertIcon);
uploadRouter.get("/getIconById/:id", new FileController_1.FileControler().getIconById);
exports.default = uploadRouter;
