"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleChangeIconName = exports.handleRenameIconFile = void 0;
const constants_1 = require("../common/constants");
const functions_1 = require("../common/functions");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function handleRenameIconFile(req, file) {
    const fileExtension = (0, functions_1.getExtension)(file.originalname);
    const newName = (0, functions_1.randomId)(50) + "." + fileExtension;
    const destination = `./../assets${constants_1.iconFolder}`;
    const imgLink = req.protocol + '://' + constants_1.HOST_NAME + constants_1.iconFolder + newName;
    const imgId = (0, functions_1.randomId)(50);
    fs_1.default.rename(path_1.default.join(__dirname, destination + file.originalname), path_1.default.join(__dirname, destination + newName), (err) => {
    });
    return {
        imgId,
        imgLink,
    };
}
exports.handleRenameIconFile = handleRenameIconFile;
const handleChangeIconName = (req, res, next) => {
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
    else if (requestFile === null || requestFile === void 0 ? void 0 : requestFile.multipleRoomImage) {
        const fileList = requestFile.multipleRoomImage;
        fileList.forEach((file, index) => {
            let info = handleRenameIconFile(req, file);
            iconInfo.push(info);
        });
    }
    // Pass img info forr the next middleware
    req.iconInfo = iconInfo.length === 0 ? null : iconInfo;
    next();
    // res.status(200).json({ status: 200, message: "Ok" });
};
exports.handleChangeIconName = handleChangeIconName;
