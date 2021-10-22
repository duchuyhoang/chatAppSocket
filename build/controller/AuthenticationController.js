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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationController = void 0;
const AuthenticationDao_1 = require("../Dao/AuthenticationDao");
const Authentication_1 = require("../validations/Authentication");
const functions_1 = require("../common/functions");
const constants_1 = require("../common/constants");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthenticationController {
    constructor() {
        this.authenticationDao = new AuthenticationDao_1.AuthenticationDao();
        this.login = this.login.bind(this);
        this.signUp = this.signUp.bind(this);
        this.reLogin = this.reLogin.bind(this);
        this.refreshToken = this.refreshToken.bind(this);
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const isValid = yield Authentication_1.LoginSchema.validate({ email, password }, {
                    abortEarly: false,
                });
            }
            catch (error) {
                (0, functions_1.throwValidateError)(error, next);
                return;
            }
            try {
                const user = yield this.authenticationDao.login(email, password);
                if (user === null)
                    res.status(constants_1.UNAUTHORIZED).json({ message: "Unauthorized" });
                else {
                    const { password } = user, userInfo = __rest(user, ["password"]);
                    res.json({
                        accessToken: (0, functions_1.generateAccessToken)(Object.assign({}, userInfo)),
                        refreshToken: (0, functions_1.generateRefreshToken)(Object.assign({}, userInfo)),
                    });
                }
            }
            catch (error) {
                (0, functions_1.throwHttpError)(constants_1.DB_ERROR, constants_1.BAD_REQUEST, next);
            }
        });
    }
    signUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, phone, name, sex } = req.body;
            let avatar = null;
            try {
                const isValid = yield Authentication_1.SignupSchema.validate({
                    email,
                    password,
                    phone,
                    name,
                    avatar,
                    sex,
                }, {
                    abortEarly: false,
                });
            }
            catch (error) {
                (0, functions_1.throwValidateError)(error, next);
                return;
            }
            try {
                const isUserExist = yield this.authenticationDao.checkUserExist(email);
                if (!isUserExist) {
                    try {
                        if (res.locals.imageInfo) {
                            const link = yield (0, functions_1.uploadSingle)({
                                file: res.locals.imageInfo[0].originalFile,
                                newName: res.locals.imageInfo[0].newName,
                            });
                            avatar = link;
                        }
                    }
                    catch (error) { }
                    const insertRecord = yield this.authenticationDao.signup({
                        email,
                        password,
                        phone,
                        name,
                        avatar,
                        sex,
                    });
                    res.json({
                        accessToken: (0, functions_1.generateAccessToken)({
                            id_user: insertRecord.insertId,
                            email,
                            phone,
                            name,
                            avatar,
                        }),
                        refreshToken: (0, functions_1.generateRefreshToken)({
                            id_user: insertRecord.insertId,
                            email,
                            phone,
                            name,
                            avatar,
                        }),
                    });
                }
                else
                    (0, functions_1.throwNormalError)("User exist", next);
            }
            catch (error) {
                (0, functions_1.throwHttpError)(constants_1.DB_ERROR, constants_1.BAD_REQUEST, next);
            }
        });
    }
    reLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldTokenInfo = res.locals.decodeToken || null;
            if (oldTokenInfo) {
                const { exp, tokenExpireTime, iat } = oldTokenInfo, rest = __rest(oldTokenInfo, ["exp", "tokenExpireTime", "iat"]);
                const userInfo = yield this.authenticationDao.reLogin(oldTokenInfo.id_user);
                if (userInfo) {
                    const { password } = userInfo, rest = __rest(userInfo, ["password"]);
                    const accessToken = (0, functions_1.generateAccessToken)(Object.assign({}, rest));
                    res.json({
                        accessToken: accessToken,
                    });
                }
                else {
                    res.status(401).json({ message: "Unauthorized" });
                }
            }
            else
                res.status(401).json({ message: "Unauthorized" });
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.body.refresh_token || null;
            if (refreshToken) {
                jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || "", (err, decode) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        res.status(401).json({ err });
                    }
                    else {
                        const { id_user } = decode;
                        const userInfo = yield this.authenticationDao.reLogin(id_user.toString());
                        if (userInfo) {
                            const { password } = userInfo, rest = __rest(userInfo, ["password"]);
                            const accessToken = (0, functions_1.generateAccessToken)(Object.assign({}, rest));
                            res.status(200).json({ accessToken });
                        }
                        else
                            res.status(401).json({ message: "Unauthorized" });
                    }
                }));
            }
            else
                res.status(401).json({ message: "Unauthorized" });
        });
    }
}
exports.AuthenticationController = AuthenticationController;
