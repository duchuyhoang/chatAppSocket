"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUploadFile = exports.imageUpload = exports.iconUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const functions_1 = require("./functions");
const constants_1 = require("./constants");
exports.iconUpload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fieldSize: 20000,
        // TODO: Change this line after compression
        fileSize: 1500000, // 150 KB for a 1080x1080 JPG 90
    },
    fileFilter: function (req, file, cb) {
        checkImageType(file, cb);
    },
});
exports.imageUpload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fieldSize: 20000,
        // TODO: Change this line after compression
        fileSize: 1500000, // 150 KB for a 1080x1080 JPG 90
    },
    fileFilter: function (req, file, cb) {
        checkImageType(file, cb);
    },
});
function checkImageType(file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    }
    else {
        cb(new Error("Accept only jpeg jpg png"));
    }
}
function handleRenameIconFile(req, file) {
    const fileExtension = (0, functions_1.getExtension)(file.originalname);
    const newName = (0, functions_1.randomId)(50) + "." + fileExtension;
    const destination = `./../assets${constants_1.iconFolder}`;
    const imgLink = req.protocol + "://" + constants_1.HOST_NAME + constants_1.iconFolder + newName;
    const imgId = (0, functions_1.randomId)(50);
    //   fs.rename(
    //     path.join(__dirname, destination + file.originalname),
    //     path.join(__dirname, destination + newName),
    //     (err) => {}
    //   );
    return {
        originalFile: file,
        imgId,
        imgLink,
        newName,
        mimetype: file.mimetype,
        buffer: file.buffer
    };
}
const handleUploadFile = (req, res, next) => {
    let iconInfo = [];
    const requestFile = req === null || req === void 0 ? void 0 : req.files;
    // typeof req?.files==="object" &&
    // Form data and multer using field in files
    if (requestFile === null || requestFile === void 0 ? void 0 : requestFile.singleImage) {
        const singleFile = requestFile.singleImage[0];
        let info = handleRenameIconFile(req, singleFile);
        iconInfo.push(info);
        // const newName=random.randonString(36);
        // const fileExtension=getExtension(singleFile.originalname)
        // fs.rename(path.join(__dirname,"./../assets/roomImg/"+singleFile.originalname))
    }
    else if (requestFile === null || requestFile === void 0 ? void 0 : requestFile.multipleImage) {
        const fileList = requestFile.multipleImage;
        fileList.forEach((file, index) => {
            iconInfo.push(handleRenameIconFile(req, file));
        });
    }
    // Pass img info forr the next middleware
    res.locals.imageInfo = iconInfo.length === 0 ? null : iconInfo;
    next();
};
exports.handleUploadFile = handleUploadFile;
