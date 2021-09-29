"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const roomMiddlewares_1 = require("../middlewares/roomMiddlewares");
const FileController_1 = require("../controller/FileController");
const path_1 = __importDefault(require("path"));
const uploadRouter = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./assets/icon");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const iconUpload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fieldSize: 20000,
        // TODO: Change this line after compression
        fileSize: 1500000, // 150 KB for a 1080x1080 JPG 90
    },
    fileFilter: function (_req, file, cb) {
        checkIcon(file, cb);
    },
});
function checkIcon(file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    }
    else {
        cb(new Error("Acepit only jpeg jpg png"));
    }
}
uploadRouter.post("/iconCreate", iconUpload.fields([
    {
        name: "singleImage",
        maxCount: 1,
    },
]), roomMiddlewares_1.handleChangeIconName, new FileController_1.FileControler().validateIcon, new FileController_1.FileControler().insertIcon);
uploadRouter.get("/getIconById/:id", new FileController_1.FileControler().getIconById);
exports.default = uploadRouter;
