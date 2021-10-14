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
exports.MessageController = void 0;
const MessageDao_1 = require("../Dao/MessageDao");
const Message_1 = require("../models/Message");
const Message_2 = require("../validations/Message");
const functions_1 = require("../common/functions");
const constants_1 = require("../common/constants");
const UserInConversationDao_1 = require("../Dao/UserInConversationDao");
const MessageCache_1 = require("../cache/MessageCache");
const actions_1 = require("../socket/NotificationSocket/actions");
const actions_2 = require("../socket/ConversationSocket/actions");
const pagination_1 = require("../common/pagination");
class MessageController {
    constructor() {
        this.emitMessage = (req, listUser, userInfo, id_conversation, notificationEmitData, messageEmitData) => {
            const notificationSocket = req.app.get(constants_1.SOCKET_LIST)[constants_1.SOCKET_NAMESPACE.NOTIFICATION];
            const conversationSocket = req.app.get(constants_1.SOCKET_LIST)[constants_1.SOCKET_NAMESPACE.CONVERSATION];
            // Emit notification for each user in room
            listUser.forEach((user) => {
                if (user.status === constants_1.USER_IN_ROOM_STATUS.NORMAL &&
                    user.id_user.toString() !== userInfo.id_user.toString()) {
                    actions_1.NotificationSocketActions.emitNotification(notificationSocket, constants_1.SOCKET_PREFIX.NOTIFICATION + user.id_user, {
                        type: constants_1.NOTIFICATION_TYPE.NEW_MESSAGE,
                        id_owner: userInfo.id_user,
                        data: Object.assign({}, notificationEmitData),
                        createAt: new Date().toISOString(),
                    });
                }
            });
            // Message emit
            actions_2.RoomSocketActions.emitMessageToConversation(conversationSocket, id_conversation, {
                id_owner: userInfo.id_user.toString(),
                messageType: constants_1.MESSAGE_TYPE.TEXT,
                createAt: new Date().toISOString(),
                data: messageEmitData,
            });
        };
        this.messageDao = new MessageDao_1.MessageDao();
        this.userInConversationDao = new UserInConversationDao_1.UserInConversationDao();
        this.emitMessage = this.emitMessage.bind(this);
        this.insertNewMessage = this.insertNewMessage.bind(this);
        this.getMesssages = this.getMesssages.bind(this);
    }
    insertNewMessage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { type, id_conversation = "" } = req.body;
            const userInfo = res.locals.decodeToken;
            const notificationSocket = req.app.get(constants_1.SOCKET_LIST)[constants_1.SOCKET_NAMESPACE.NOTIFICATION];
            let listImageLink = null;
            let imageLink = null;
            const listUser = yield this.userInConversationDao.getAllConversationUser(
            // userInfo.id_user.toString(),
            id_conversation || "");
            switch (type.toString()) {
                case constants_1.MESSAGE_TYPE.TEXT.toString():
                    yield this.insertTextMessage(req, res, next, listUser);
                    break;
                case constants_1.MESSAGE_TYPE.IMAGE.toString():
                    yield this.insertImageMessage(req, res, next, listUser);
                    break;
                case constants_1.MESSAGE_TYPE.TEXT_AND_IMAGE.toString():
                    yield this.insertTextAndMessage(req, res, next, listUser);
                    break;
                default:
                    res.status(constants_1.BAD_REQUEST).json({ message: "Something wrong!" });
            }
            // try {
            //   const listImage: IconInfo[] = res.locals.imageInfo;
            //   if (listImage) {
            //     if (listImage.length === 1) {
            //       imageLink = await uploadSingle({
            //         file: res.locals.imageInfo[0].originalFile,
            //         newName: res.locals.imageInfo[0].newName,
            //       });
            //     } else {
            //       listImageLink = await uploadMultipleImage(
            //         listImage.map((image: IconInfo) => ({
            //           file: image.originalFile,
            //           newName: image.newName,
            //         }))
            //       );
            //     }
            //     // else
            //   }
            // } catch (err) {}
        });
    }
    insertTextMessage(req, res, next, listUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const { content, id_conversation } = req.body;
            const cachePrefix = constants_1.CACHE_PREFIX.MESSAGE + id_conversation;
            const userInfo = res.locals.decodeToken;
            try {
                const dbResult = yield this.messageDao.insertNewTextMessage({
                    content,
                    id_conversation,
                    id_user: userInfo.id_user.toString(),
                });
                const message = (0, Message_1.generateMessage)({
                    id_message: dbResult.insertId.toString(),
                    type: constants_1.MESSAGE_TYPE.TEXT,
                    content: content,
                    id_user: userInfo.id_user.toString(),
                    userInfo,
                    delFlag: constants_1.DEL_FLAG.VALID,
                    id_conversation,
                    createAt: new Date().toISOString(),
                });
                // Set cache
                MessageCache_1.MessageCache.set(constants_1.CACHE_PREFIX.MESSAGE + id_conversation, [
                    ...(MessageCache_1.MessageCache.get(cachePrefix) || []),
                    message,
                ]);
                this.emitMessage(req, listUser, userInfo, id_conversation, {
                    idMessage: dbResult.insertId,
                    notificationType: constants_1.NOTIFICATION_TYPE.NEW_MESSAGE,
                    messageType: constants_1.MESSAGE_TYPE.TEXT,
                    creator: userInfo,
                    default: "New message",
                    data: content,
                }, message);
                res.json({ message: "ok" });
            }
            catch (err) {
                (0, functions_1.throwHttpError)(constants_1.DB_ERROR, constants_1.BAD_REQUEST, next);
            }
        });
    }
    insertImageMessage(req, res, next, listUser) {
        return __awaiter(this, void 0, void 0, function* () {
            let listImageLink = null;
            let imageLink = null;
            let data = [];
            const { type, id_conversation = "" } = req.body;
            const cachePrefix = constants_1.CACHE_PREFIX.MESSAGE + id_conversation;
            const userInfo = res.locals.decodeToken;
            try {
                const listImage = res.locals.imageInfo;
                if (listImage) {
                    if (listImage.length === 1) {
                        imageLink = yield (0, functions_1.uploadSingle)({
                            file: res.locals.imageInfo[0].originalFile,
                            newName: res.locals.imageInfo[0].newName,
                        });
                        const dbResult = yield this.messageDao.insertNewImageMessage({
                            url: imageLink,
                            id_user: userInfo.id_user.toString(),
                            id_conversation,
                        });
                        data.push((0, Message_1.generateMessage)({
                            id_message: dbResult.insertId.toString(),
                            type: constants_1.MESSAGE_TYPE.IMAGE,
                            url: imageLink,
                            id_user: userInfo.id_user.toString(),
                            userInfo,
                            delFlag: constants_1.DEL_FLAG.VALID,
                            id_conversation,
                            createAt: new Date().toISOString(),
                        }));
                    }
                    else if (listImage.length > 1) {
                        listImageLink = yield (0, functions_1.uploadMultipleImage)(listImage.map((image) => ({
                            file: image.originalFile,
                            newName: image.newName,
                        })));
                        const insertData = (0, functions_1.forBulkInsert)(listImageLink.map((link) => ({
                            id_conversation,
                            type: constants_1.MESSAGE_TYPE.IMAGE,
                            link,
                            createAt: (0, functions_1.formatDate)(new Date()),
                        })), userInfo.id_user.toString());
                        const dbResult = yield this.messageDao.insertMultipleImageMessage(insertData);
                        for (let i = 0; i < dbResult.affectedRows; i++) {
                            data.push((0, Message_1.generateMessage)({
                                id_message: (parseInt(dbResult.insertId.toString()) + i).toString(),
                                type: constants_1.MESSAGE_TYPE.IMAGE,
                                url: listImageLink[i],
                                id_user: userInfo.id_user.toString(),
                                userInfo,
                                delFlag: constants_1.DEL_FLAG.VALID,
                                id_conversation,
                                createAt: new Date().toISOString(),
                            }));
                        }
                    }
                    // set cache
                    MessageCache_1.MessageCache.set(constants_1.CACHE_PREFIX.MESSAGE + id_conversation, [
                        ...(MessageCache_1.MessageCache.get(cachePrefix) || []),
                        ...data,
                    ]);
                    this.emitMessage(req, listUser, userInfo, id_conversation, {
                        type: constants_1.MESSAGE_TYPE.IMAGE,
                        notificationType: constants_1.NOTIFICATION_TYPE.NEW_MESSAGE,
                        creator: userInfo,
                        default: "New image",
                        data,
                    }, data);
                    // else
                    res.json({ data });
                }
            }
            catch (err) {
                (0, functions_1.throwHttpError)(constants_1.DB_ERROR, constants_1.BAD_REQUEST, next);
            }
        });
    }
    insertTextAndMessage(req, res, next, listUser) {
        return __awaiter(this, void 0, void 0, function* () {
            let listImageLink = null;
            let imageLink = null;
            let data = [];
            const { type, id_conversation = "", content } = req.body;
            const cachePrefix = constants_1.CACHE_PREFIX.MESSAGE + id_conversation;
            const userInfo = res.locals.decodeToken;
            const listImage = res.locals.imageInfo;
            try {
                // Message handle
                const dbMessageResult = yield this.messageDao.insertNewTextMessage({
                    content,
                    id_conversation,
                    id_user: userInfo.id_user.toString(),
                });
                data.push((0, Message_1.generateMessage)({
                    id_message: dbMessageResult.insertId.toString(),
                    type: constants_1.MESSAGE_TYPE.TEXT,
                    content: content,
                    id_user: userInfo.id_user.toString(),
                    userInfo,
                    delFlag: constants_1.DEL_FLAG.VALID,
                    id_conversation,
                    createAt: new Date().toISOString(),
                }));
                // Image handle
                if (listImage) {
                    if (listImage.length === 1) {
                        imageLink = yield (0, functions_1.uploadSingle)({
                            file: res.locals.imageInfo[0].originalFile,
                            newName: res.locals.imageInfo[0].newName,
                        });
                        const dbResult = yield this.messageDao.insertNewImageMessage({
                            url: imageLink,
                            id_user: userInfo.id_user.toString(),
                            id_conversation,
                        });
                        data.push((0, Message_1.generateMessage)({
                            id_message: dbResult.insertId.toString(),
                            type: constants_1.MESSAGE_TYPE.IMAGE,
                            url: imageLink,
                            createAt: new Date().toISOString(),
                            userInfo,
                            delFlag: constants_1.DEL_FLAG.VALID,
                            id_conversation,
                            id_user: userInfo.id_user.toString(),
                        }));
                    }
                    else if (listImage.length > 1) {
                        listImageLink = yield (0, functions_1.uploadMultipleImage)(listImage.map((image) => ({
                            file: image.originalFile,
                            newName: image.newName,
                        })));
                        const insertData = (0, functions_1.forBulkInsert)(listImageLink.map((link) => ({
                            id_conversation,
                            type: constants_1.MESSAGE_TYPE.IMAGE,
                            link,
                            createAt: (0, functions_1.formatDate)(new Date()),
                        })), userInfo.id_user.toString());
                        const dbResult = yield this.messageDao.insertMultipleImageMessage(insertData);
                        for (let i = 0; i < dbResult.affectedRows; i++) {
                            data.push((0, Message_1.generateMessage)({
                                id_message: (parseInt(dbResult.insertId.toString()) + i).toString(),
                                type: constants_1.MESSAGE_TYPE.IMAGE,
                                url: listImageLink[i],
                                createAt: new Date().toISOString(),
                                userInfo,
                                delFlag: constants_1.DEL_FLAG.VALID,
                                id_conversation,
                                id_user: userInfo.id_user.toString(),
                            }));
                        }
                    }
                    // set cache
                    MessageCache_1.MessageCache.set(constants_1.CACHE_PREFIX.MESSAGE + id_conversation, [
                        ...(MessageCache_1.MessageCache.get(cachePrefix) || []),
                        ...data,
                    ]);
                    this.emitMessage(req, listUser, userInfo, id_conversation, {
                        type: constants_1.MESSAGE_TYPE.TEXT_AND_IMAGE,
                        notificationType: constants_1.NOTIFICATION_TYPE.NEW_MESSAGE,
                        creator: userInfo,
                        default: "Text and image",
                        data,
                    }, data);
                    // else
                    res.json({ data });
                }
            }
            catch (err) {
                (0, functions_1.throwHttpError)(constants_1.DB_ERROR, constants_1.BAD_REQUEST, next);
            }
        });
    }
    getMesssages(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, limit, id_conversation = "" } = req.query;
            try {
                const isValid = yield Message_2.GetMessageSchema.validate({
                    offset,
                    limit,
                });
            }
            catch (err) {
                (0, functions_1.throwValidateError)(err, next);
                return;
            }
            const userInfo = res.locals.decodeToken;
            let userExist = false;
            try {
                const listUser = yield this.userInConversationDao.getAllConversationUser((id_conversation === null || id_conversation === void 0 ? void 0 : id_conversation.toString()) || "");
                for (let i = 0; i < listUser.length; i++) {
                    if (listUser[i].id_user.toString() === userInfo.id_user.toString()) {
                        userExist = true;
                        break;
                    }
                }
                if (!userExist) {
                    res.status(constants_1.UNAUTHORIZED).json({ message: "Unauthorized" });
                    return;
                }
                let listMessage = [];
                const memoMessages = MessageCache_1.MessageCache.get(constants_1.CACHE_PREFIX.MESSAGE + id_conversation);
                if (!memoMessages) {
                    listMessage = yield this.messageDao.getMessageByConversation((id_conversation === null || id_conversation === void 0 ? void 0 : id_conversation.toString()) || "");
                    MessageCache_1.MessageCache.set(constants_1.CACHE_PREFIX.MESSAGE + id_conversation, listMessage);
                }
                else {
                    console.log("memo");
                    listMessage = memoMessages;
                }
                res.json(Object.assign({}, (0, pagination_1.Pagination)(listMessage, parseInt((offset === null || offset === void 0 ? void 0 : offset.toString()) || "0"), parseInt((limit === null || limit === void 0 ? void 0 : limit.toString()) || "1"))));
            }
            catch (err) {
                (0, functions_1.throwHttpError)(constants_1.DB_ERROR, constants_1.BAD_REQUEST, next);
            }
        });
    }
}
exports.MessageController = MessageController;
