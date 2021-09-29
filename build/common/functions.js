"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = exports.throwNormalError = exports.throwHttpError = exports.throwValidateError = exports.bindLocals = exports.getExtension = exports.randomId = void 0;
const path_1 = __importDefault(require("path"));
const CustomValidationError_1 = require("../models/CustomValidationError");
const HttpError_1 = require("../models/HttpError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
    next(new CustomValidationError_1.CustomValidationError(constants_1.VALIDATION_ERROR, constants_1.VALIDATION_STATUS, error.inner.map((err) => {
        return {
            field: err.path || "",
            errors: err.errors || [],
        };
    })));
};
exports.throwValidateError = throwValidateError;
const throwNormalError = (message, next) => {
    next(new Error("Unexpected error"));
};
exports.throwNormalError = throwNormalError;
const throwHttpError = (message, status, next) => {
    next(new HttpError_1.HttpError(message, status));
};
exports.throwHttpError = throwHttpError;
const generateAccessToken = (input) => {
    const tokenExpireTime = Date.now() + parseInt(process.env.TOKEN_EXPIRE_TIME);
    return jsonwebtoken_1.default.sign(Object.assign(Object.assign({}, input), { tokenExpireTime }), process.env.TOKEN_SECRET, { algorithm: 'HS256', expiresIn: parseInt(process.env.TOKEN_EXPIRE_TIME) / 1000, });
    // process.env.TOKEN_EXPIRE_TIME / 1000
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (input) => {
    const refrestTokenExpireTime = Date.now() + parseInt(process.env.REFRESH_TOKEN_EXPIRE_TIME);
    return jsonwebtoken_1.default.sign(Object.assign(Object.assign({}, input), { refrestTokenExpireTime }), process.env.REFRESH_TOKEN_SECRET, { algorithm: 'HS256', expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRE_TIME) / 1000 });
    // process.env.REFRESH_TOKEN_EXPIRE_TIME / 1000
};
exports.generateRefreshToken = generateRefreshToken;
