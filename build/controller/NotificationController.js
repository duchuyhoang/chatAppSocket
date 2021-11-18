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
exports.NotificationController = void 0;
const NotificationDao_1 = require("../Dao/NotificationDao");
const ConversationDao_1 = require("../Dao/ConversationDao");
const Notification_1 = require("../validations/Notification");
const functions_1 = require("../common/functions");
const constants_1 = require("../common/constants");
const actions_1 = require("../socket/NotificationSocket/actions");
const UserDao_1 = require("../Dao/UserDao");
const UserLastSeenMessageDao_1 = require("../Dao/UserLastSeenMessageDao");
const UserInConversationDao_1 = require("../Dao/UserInConversationDao");
const actions_2 = require("../socket/ConversationSocket/actions");
class NotificationController {
    constructor() {
        this.notificationDao = new NotificationDao_1.NotificationDao();
        this.userDao = new UserDao_1.UserDao();
        this.conversationDao = new ConversationDao_1.ConversationDao();
        this.userLastSeenMessageDao = new UserLastSeenMessageDao_1.UserLastSeenMessageDao();
        this.userInConversationDao = new UserInConversationDao_1.UserInConversationDao();
        this.insertNewNotification = this.insertNewNotification.bind(this);
        this.getAllNotificationByUser = this.getAllNotificationByUser.bind(this);
        this.getConversationById = this.getConversationById.bind(this);
        this.answerFriendRequest = this.answerFriendRequest.bind(this);
    }
    getAllNotificationByUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userInfo = res.locals.decodeToken;
            try {
                const result = yield this.notificationDao.getAllNotificationByUser(userInfo.id_user.toString());
                res.json({ data: result });
            }
            catch (err) {
                (0, functions_1.throwHttpError)(constants_1.DB_ERROR, constants_1.BAD_REQUEST, next);
            }
        });
    }
    insertNewNotification(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { type, id_receiver, message = null } = req.body;
            const userInfo = res.locals.decodeToken;
            try {
                const isValid = yield Notification_1.CreateNotificationSchema.validate({
                    type,
                    id_receiver,
                });
            }
            catch (err) {
                (0, functions_1.throwValidateError)(err, next);
                return;
            }
            try {
                const notificationSocket = req.app.get(constants_1.SOCKET_LIST) &&
                    req.app.get(constants_1.SOCKET_LIST)[constants_1.SOCKET_NAMESPACE.NOTIFICATION];
                if (!notificationSocket) {
                    (0, functions_1.throwHttpError)("Something wrong", constants_1.BAD_REQUEST, next);
                    return;
                }
                switch (parseInt(type.toString())) {
                    case constants_1.NOTIFICATION_TYPE.FRIEND_REQUEST:
                        this.insertFriendRequest(res, next, notificationSocket, id_receiver, userInfo, message);
                        break;
                    default:
                        res
                            .status(constants_1.BAD_REQUEST)
                            .json({ message: "Server is working on that type" });
                }
            }
            catch (e) {
                (0, functions_1.throwHttpError)("Something wrong", constants_1.BAD_REQUEST, next);
            }
        });
    }
    getConversationById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id || "";
            const userInfo = res.locals.decodeToken;
            try {
                const result = yield this.notificationDao.getSpecificNotification(userInfo.id_user.toString(), id);
                res.json({ data: result });
            }
            catch (err) {
                (0, functions_1.throwHttpError)(constants_1.DB_ERROR, constants_1.BAD_REQUEST, next);
            }
        });
    }
    answerFriendRequest(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userInfo = res.locals.decodeToken;
            const { status, id_notification = "", id_sender = "" } = req.body;
            let newConversation1 = null;
            let newConversation2 = null;
            const notificationSocket = req.app.get(constants_1.SOCKET_LIST) &&
                req.app.get(constants_1.SOCKET_LIST)[constants_1.SOCKET_NAMESPACE.NOTIFICATION];
            if (!notificationSocket) {
                (0, functions_1.throwHttpError)("Something wrong", constants_1.BAD_REQUEST, next);
            }
            if (status.toString() !== constants_1.NOTIFICATION_STATUS.FULFILLED.toString() &&
                status.toString() !== constants_1.NOTIFICATION_STATUS.REJECT.toString()) {
                res.status(constants_1.BAD_REQUEST).json({ message: "BAD REQUEST" });
            }
            try {
                const result = yield this.notificationDao.answerFriendRequest(userInfo.id_user.toString(), id_sender, id_notification, status.toString());
                if (result.affectedRows === 0) {
                    res.status(constants_1.BAD_REQUEST).json({ message: "Something wrong" });
                    return;
                }
                if (status.toString() === "1") {
                    yield this.userDao.insertNewStatusBetween(userInfo.id_user.toString(), id_sender, status);
                    const { insertId: newIdRoom } = yield this.conversationDao.addNewPrivateConversation(userInfo.id_user.toString());
                    const data = (0, functions_1.forBulkInsert)([{ id_user: id_sender }, { id_user: userInfo.id_user.toString() }], newIdRoom.toString());
                    yield this.userInConversationDao.addUsersToConversation(data);
                    const listUserToConversation = [
                        ...[userInfo.id_user.toString(), id_sender].map((id) => this.userLastSeenMessageDao.addUserToRoom(newIdRoom.toString(), id)),
                    ];
                    yield Promise.all([listUserToConversation]);
                    newConversation1 = yield this.conversationDao.getConversationById(userInfo.id_user, newIdRoom.toString());
                    newConversation2 = yield this.conversationDao.getConversationById(id_sender, newIdRoom.toString());
                    const conversationSocket = req.app.get(constants_1.SOCKET_LIST)[constants_1.SOCKET_NAMESPACE.CONVERSATION];
                    if (conversationSocket) {
                        if (newConversation1 && newConversation2) {
                            actions_2.RoomSocketActions.joinPrivateRoom(conversationSocket, [userInfo.id_user.toString()], newConversation1);
                            actions_2.RoomSocketActions.joinPrivateRoom(conversationSocket, [id_sender], newConversation2);
                        }
                    }
                    // await this.
                }
                const receiverInfo = yield this.userDao.getUserInfoById(userInfo.id_user.toString(), id_sender);
                const senderInfo = yield this.userDao.getUserInfoById(id_sender, userInfo.id_user.toString());
                if (!receiverInfo || !senderInfo) {
                    res.status(constants_1.BAD_REQUEST).json({ message: "Something wrong" });
                    return;
                }
                else {
                    res.json({ message: "Success" });
                    // Send to sender
                    actions_1.NotificationSocketActions.emitNotification(notificationSocket, constants_1.SOCKET_PREFIX.NOTIFICATION + id_sender, {
                        id_owner: userInfo.id_user,
                        type: constants_1.NOTIFICATION_TYPE.ACCEPT_FRIEND_REQUEST,
                        createAt: new Date().toISOString(),
                        data: {
                            user: senderInfo,
                            newConversation: newConversation2,
                            // newRoom:
                        },
                    });
                    // Send to current user
                    actions_1.NotificationSocketActions.emitNotification(notificationSocket, constants_1.SOCKET_PREFIX.NOTIFICATION + userInfo.id_user, {
                        id_owner: userInfo.id_user,
                        type: constants_1.NOTIFICATION_TYPE.ACCEPT_FRIEND_REQUEST,
                        createAt: new Date().toISOString(),
                        data: {
                            user: receiverInfo,
                            newConversation: newConversation1,
                        },
                    });
                }
            }
            catch (err) {
                console.log(err);
                (0, functions_1.throwHttpError)(constants_1.DB_ERROR, constants_1.BAD_REQUEST, next);
            }
        });
    }
    insertFriendRequest(res, next, notificationNamespace, id_receiver, userInfo, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.notificationDao.insertNewFriendRequestNotification({
                    id_receiver,
                    id_owner: userInfo.id_user.toString(),
                    message: message || "",
                });
                actions_1.NotificationSocketActions.emitNotification(notificationNamespace, constants_1.SOCKET_PREFIX.NOTIFICATION + id_receiver, {
                    id_owner: userInfo.id_user,
                    type: constants_1.NOTIFICATION_TYPE.FRIEND_REQUEST,
                    createAt: new Date().toISOString(),
                    data: {
                        idNotifcation: result.insertId,
                        message,
                    },
                });
                res.json({ message: "Ok" });
            }
            catch (err) {
                (0, functions_1.throwHttpError)(constants_1.DB_ERROR, constants_1.BAD_REQUEST, next);
            }
        });
    }
}
exports.NotificationController = NotificationController;
