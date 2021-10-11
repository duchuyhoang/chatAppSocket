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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserActions = void 0;
const constants_1 = require("../../common/constants");
const UserDao_1 = require("../../Dao/UserDao");
const socket_1 = require("../../common/socket");
const userOnline = {};
exports.UserActions = {
    initialActions: (namespace, socket) => __awaiter(void 0, void 0, void 0, function* () {
        const userDao = new UserDao_1.UserDao();
        const userInfo = socket.data.decode;
        // Join room with prefix and user id
        (0, socket_1.resetRoom)(socket, socket.id, constants_1.SOCKET_PREFIX.USER + userInfo.id_user);
        userOnline[constants_1.SOCKET_PREFIX.USER + userInfo.id_user] = userInfo;
        const listUsers = namespace.adapter.rooms;
        try {
            const listFriend = yield userDao.getListFriend(userInfo.id_user.toString());
            const listFriendReturn = listFriend.map((friend) => {
                const { password } = friend, rest = __rest(friend, ["password"]);
                // emit to all of this user friends that he or she is online
                if (userOnline[constants_1.SOCKET_PREFIX.USER + friend.id_user]) {
                    namespace
                        .to(constants_1.SOCKET_PREFIX.USER + friend.id_user)
                        .emit(constants_1.SOCKET_EMIT_ACTIONS.USER_JOIN_APPLICATION, {
                        user: userInfo.id_user,
                    });
                }
                return Object.assign(Object.assign({}, rest), { online: userOnline[constants_1.SOCKET_PREFIX.USER + friend.id_user]
                        ? true
                        : false });
            });
            socket.emit(constants_1.SOCKET_EMIT_ACTIONS.SOCKET_READY);
            // Pass list friend to current user
            socket.emit(constants_1.SOCKET_EMIT_ACTIONS.LIST_FRIEND, { data: listFriendReturn });
        }
        catch (err) {
            socket.emit(constants_1.SOCKET_EMIT_ACTIONS.LIST_FRIEND, { data: [] });
        }
    }),
    onDisconnect: (namespace, socket) => {
        const userDao = new UserDao_1.UserDao();
        const userInfo = socket.data.decode;
        return (socket) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const listFriend = yield userDao.getListFriend(userInfo.id_user.toString());
                // emit to this user friends that he/she left
                listFriend.map((friend) => {
                    friend.id_user.toString() !== userInfo.id_user.toString() &&
                        namespace
                            .to(constants_1.SOCKET_PREFIX.USER + friend.id_user)
                            .emit(constants_1.SOCKET_EMIT_ACTIONS.USER_QUIT_APPLICATION, {
                            user: friend.id_user,
                        });
                });
                socket.leave(constants_1.SOCKET_PREFIX.USER + userInfo.id_user);
                //   update lastSeen
                yield userDao.updateLastSeen(userInfo.id_user.toString());
                //   Delete user from user online
                delete userOnline[constants_1.SOCKET_PREFIX.USER + userInfo.id_user];
            }
            catch (err) { }
        });
    },
    checkUserOnline(id_user) {
        return userOnline[constants_1.SOCKET_PREFIX.USER + id_user] ? true : false;
    },
};
