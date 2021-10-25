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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const constants_1 = require("../common/constants");
const functions_1 = require("../common/functions");
const UserDao_1 = require("../Dao/UserDao");
const Authentication_1 = require("../validations/Authentication");
class UserController {
    constructor() {
        this.UserDao = new UserDao_1.UserDao();
        this.getUserFriend = this.getUserFriend.bind(this);
        this.searchUserByEmailOrPhone = this.searchUserByEmailOrPhone.bind(this);
        this.viewRelationshipStatus = this.viewRelationshipStatus.bind(this);
        this.editUser = this.editUser.bind(this);
        this.getUserById = this.getUserById.bind(this);
    }
    getUserFriend(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_user } = res.locals.decodeToken;
            try {
                const result = yield this.UserDao.getListFriend(id_user);
                res.json({ listFriend: result });
            }
            catch (e) {
                (0, functions_1.throwHttpError)(constants_1.DB_ERROR, constants_1.BAD_REQUEST, next);
            }
        });
    }
    searchUserByEmailOrPhone(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { keyword = null } = req.query;
            const userInfo = res.locals.decodeToken;
            try {
                const result = yield this.UserDao.searchUserByEmailOrPhone((keyword === null || keyword === void 0 ? void 0 : keyword.toString()) || "", userInfo.id_user.toString());
                // result.map((user)=>{
                //   delete
                // })
                res.json({ result });
            }
            catch (err) {
                console.log(err);
                (0, functions_1.throwHttpError)(constants_1.DB_ERROR, constants_1.BAD_REQUEST, next);
            }
        });
    }
    viewRelationshipStatus(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_friend } = req.params;
            const userInfo = res.locals.decodeToken;
            if (!id_friend) {
                res.status(constants_1.BAD_REQUEST).json({ message: "Id friend required" });
                return;
            }
            try {
                const status = yield this.UserDao.getFriendStatusBetween(userInfo.id_user.toString(), id_friend.toString() || "");
                res.json({ status });
            }
            catch (err) {
                (0, functions_1.throwHttpError)(constants_1.DB_ERROR, constants_1.BAD_REQUEST, next);
            }
        });
    }
    getUserById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const userInfo = res.locals.decodeToken;
            try {
                const result = yield this.UserDao.getUserInfoById(userInfo.id_user.toString(), (id === null || id === void 0 ? void 0 : id.toString()) || "");
                res.json({ data: result });
            }
            catch (err) {
                console.log(err);
                (0, functions_1.throwHttpError)(constants_1.DB_ERROR, constants_1.BAD_REQUEST, next);
            }
        });
    }
    editUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password = null, phone = null, name = null, sex = null } = req.body;
            let avatar = null;
            const userInfo = res.locals.decodeToken;
            try {
                const isValid = yield Authentication_1.UpdateUserSchema.validate({
                    password,
                    phone,
                    name,
                    sex,
                });
            }
            catch (err) {
                (0, functions_1.throwValidateError)(err, next);
                return;
            }
            try {
                if (res.locals.imageInfo) {
                    avatar = yield (0, functions_1.uploadSingle)({
                        file: res.locals.imageInfo[0].originalFile,
                        newName: res.locals.imageInfo[0].newName,
                    });
                }
            }
            catch (error) { }
            let updatePayload = {
                password,
                phone,
                name,
                sex,
                avatar,
            };
            Object.keys(updatePayload).map((key) => {
                if (!updatePayload[key])
                    delete updatePayload[key];
            });
            if (Object.keys(updatePayload).length === 0) {
                (0, functions_1.throwNormalError)("Need at least 1 field", next);
                return;
            }
            try {
                let result = yield this.UserDao.updateUser(Object.assign(Object.assign({}, updatePayload), { id_user: userInfo.id_user.toString() }));
                const newUser = yield this.UserDao.getCurrentUser(userInfo.id_user.toString());
                res.json({ data: newUser });
            }
            catch (error) {
                (0, functions_1.throwHttpError)(constants_1.DB_ERROR, constants_1.BAD_REQUEST, next);
            }
        });
    }
}
exports.UserController = UserController;
