"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = exports.forBulkInsert = exports.uploadMultipleImage = exports.uploadSingle = exports.generateRefreshToken = exports.generateAccessToken = exports.throwNormalError = exports.throwHttpError = exports.throwValidateError = exports.bindLocals = exports.getExtension = exports.randomId = void 0;
const path_1 = __importDefault(require("path"));
const CustomValidationError_1 = require("../models/CustomValidationError");
const HttpError_1 = require("../models/HttpError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_1 = require("../firebase/app");
const storage_1 = require("firebase/storage");
require("dotenv").config();
const constants_1 = require("../common/constants");
const getExtension = (filename) => {
    var ext = path_1.default.extname(filename || "").split(".");
    return ext[ext.length - 1];
};
exports.getExtension = getExtension;
const randomId = (length) => {
    var result = [];
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join("");
};
exports.randomId = randomId;
const bindLocals = (res, data) => {
    res.locals = data;
};
exports.bindLocals = bindLocals;
const throwValidateError = (error, next) => {
    var _a;
    const validateError = [...error.inner.map((err) => {
            return { field: err.path || "", errors: err.errors || [] };
        }),];
    error.params && validateError.push({ field: ((_a = error === null || error === void 0 ? void 0 : error.params) === null || _a === void 0 ? void 0 : _a.path) || "", errors: error.errors || [] });
    next(new CustomValidationError_1.CustomValidationError(constants_1.VALIDATION_ERROR, constants_1.VALIDATION_STATUS, validateError));
};
exports.throwValidateError = throwValidateError;
const throwNormalError = (message, next) => {
    next(new Error(message || "Unexpected error"));
};
exports.throwNormalError = throwNormalError;
const throwHttpError = (message, status, next) => {
    next(new HttpError_1.HttpError(message, status));
};
exports.throwHttpError = throwHttpError;
const generateAccessToken = (input) => {
    const tokenExpireTime = Date.now() + parseInt(process.env.TOKEN_EXPIRE_TIME);
    return jsonwebtoken_1.default.sign(Object.assign(Object.assign({}, input), { tokenExpireTime }), process.env.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: parseInt(process.env.TOKEN_EXPIRE_TIME) / 1000,
    });
    // process.env.TOKEN_EXPIRE_TIME / 1000
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (input) => {
    const refrestTokenExpireTime = Date.now() + parseInt(process.env.REFRESH_TOKEN_EXPIRE_TIME);
    return jsonwebtoken_1.default.sign(Object.assign(Object.assign({}, input), { refrestTokenExpireTime }), process.env.REFRESH_TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRE_TIME) / 1000,
    });
    // process.env.REFRESH_TOKEN_EXPIRE_TIME / 1000
};
exports.generateRefreshToken = generateRefreshToken;
// function translateToUploadFile(file:Express.Multer.File):UploadMulterMemoryFile{
// return {
// file,
// newName:
// }
// }
function toArrayBuffer(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}
// fileName:string,mimetype:string,buffer:Buffer
function uploadSingle(uploadedFile) {
    return __awaiter(this, void 0, void 0, function* () {
        const unit8Array = toArrayBuffer(uploadedFile.file.buffer);
        const result = yield (0, storage_1.uploadBytes)((0, app_1.storageRef)(uploadedFile.newName), unit8Array);
        const link = yield (0, storage_1.getDownloadURL)((0, app_1.storageRef)(uploadedFile.newName));
        return link;
    });
}
exports.uploadSingle = uploadSingle;
function uploadMultipleImage(listFile) {
    return __awaiter(this, void 0, void 0, function* () {
        // return new Promise<string[]>((resolve,reject) => {
        // })
        const listLink = Promise.all(listFile.map((file) => uploadSingle(file)));
        return listLink;
    });
}
exports.uploadMultipleImage = uploadMultipleImage;
const forBulkInsert = (dataList, insertedId) => {
    // imageList will be [[1,2,3],[1,4,5],[1,6,7]]
    // do this for bulk insert after
    let multidimensionArrayData = [];
    dataList.forEach((data, _) => {
        let oneArrayData = [insertedId];
        for (let key in data) {
            oneArrayData.push(data[key]);
        }
        multidimensionArrayData.push(oneArrayData);
        // imageList will be [[1,2,3],[1,4,5],[1,6,7]]
        // do this for bulk insert after
    });
    return multidimensionArrayData;
};
exports.forBulkInsert = forBulkInsert;
const formatDate = (date) => {
    var dateStr = date.getFullYear() + "-" +
        ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
        ("00" + date.getDate()).slice(-2) + " " +
        ("00" + date.getHours()).slice(-2) + ":" +
        ("00" + date.getMinutes()).slice(-2) + ":" +
        ("00" + date.getSeconds()).slice(-2);
    return dateStr;
};
exports.formatDate = formatDate;
