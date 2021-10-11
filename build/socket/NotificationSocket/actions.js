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
exports.NotificationSocketActions = void 0;
const NotificationDao_1 = require("../../Dao/NotificationDao");
const socket_1 = require("../../common/socket");
const constants_1 = require("../../common/constants");
const userNotificationList = {};
exports.NotificationSocketActions = {
    initialActions: (namespace, socket) => __awaiter(void 0, void 0, void 0, function* () {
        const userDao = new NotificationDao_1.NotificationDao();
        const userInfo = socket.data.decode;
        yield (0, socket_1.resetRoom)(socket, socket.id, constants_1.SOCKET_PREFIX.NOTIFICATION + userInfo.id_user);
        userNotificationList[constants_1.SOCKET_PREFIX.NOTIFICATION + userInfo.id_user] =
            userInfo;
        console.log("r", namespace.adapter.rooms);
        socket.emit(constants_1.SOCKET_EMIT_ACTIONS.SOCKET_READY);
    }),
    onDisconnect: (namespace, socket) => {
        const userDao = new NotificationDao_1.NotificationDao();
        const userInfo = socket.data.decode;
        return (socket) => __awaiter(void 0, void 0, void 0, function* () {
            delete userNotificationList[constants_1.SOCKET_PREFIX.NOTIFICATION + userInfo.id_user];
        });
    },
    emitNotification(namespace, room, data) {
        return __awaiter(this, void 0, void 0, function* () {
            namespace.in(room).emit(constants_1.SOCKET_EMIT_ACTIONS.EMIT_NOTIFICATION, data);
        });
    },
};
