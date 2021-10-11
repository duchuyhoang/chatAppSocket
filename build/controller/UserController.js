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
const index_1 = require("../socket/index");
;
class UserController {
    constructor() {
        this.UserDao = new UserDao_1.UserDao();
        this.getUserFriend = this.getUserFriend.bind(this);
        this.searchUserByEmailOrPhone = this.searchUserByEmailOrPhone.bind(this);
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
            if (req.app.get(constants_1.SOCKET_LIST)) {
                // const socketList = req.app.get(SOCKET_LIST);
                // const namespace: Namespace = req.app.get(SOCKET_LIST)["/USER"];
                const namespace2 = index_1.socketList["/NOTIFICATION"];
                // console.log("nn", namespace2.adapter.rooms);
            }
            else {
            }
            const { email = null, phone = null } = req.query;
            try {
                const result = yield this.UserDao.searchUserByEmailOrPhone(email, phone);
                res.json({ result });
            }
            catch (err) {
                console.log(err);
                (0, functions_1.throwHttpError)(constants_1.DB_ERROR, constants_1.BAD_REQUEST, next);
            }
        });
    }
}
exports.UserController = UserController;
