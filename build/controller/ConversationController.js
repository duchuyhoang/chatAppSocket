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
exports.ConversationController = void 0;
const ConversationDao_1 = require("../Dao/ConversationDao");
const UserInConversationDao_1 = require("../Dao/UserInConversationDao");
const functions_1 = require("../common/functions");
const Conversation_1 = require("../validations/Conversation");
const constants_1 = require("../common/constants");
const actions_1 = require("../socket/ConversationSocket/actions");
const UserLastSeenMessageDao_1 = require("../Dao/UserLastSeenMessageDao");
class ConversationController {
    constructor() {
        this.conversationDao = new ConversationDao_1.ConversationDao();
        this.userInConversationDao = new UserInConversationDao_1.UserInConversationDao();
        this.userLastSeenMessageDao = new UserLastSeenMessageDao_1.UserLastSeenMessageDao();
        this.createGroupConversation = this.createGroupConversation.bind(this);
        this.createPrivateConversation = this.createPrivateConversation.bind(this);
        this.checkPrivateConversationBetween =
            this.checkPrivateConversationBetween.bind(this);
        this.getConversations = this.getConversations.bind(this);
        this.getConversationById = this.getConversationById.bind(this);
        this.addUsersToConversation = this.addUsersToConversation.bind(this);
    }
    checkPrivateConversationBetween(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_friend } = req.body;
            const user_info = res.locals.decodeToken;
            try {
                yield Conversation_1.ConversationCheckPrivateChatExistSchema.validate({
                    id_friend,
                });
            }
            catch (error) {
                (0, functions_1.throwValidateError)(error, next);
                return;
            }
            try {
                const result = yield this.userInConversationDao.checkPrivateConversationExist(user_info.id_user.toString(), id_friend);
                if (result) {
                    res.json({ idRoom: result.id_room });
                }
                else
                    res.json({ idRoom: null });
            }
            catch (error) {
                (0, functions_1.throwHttpError)(constants_1.DB_ERROR, constants_1.BAD_REQUEST, next);
            }
        });
    }
    createGroupConversation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // list_user need to be an json array
            const { title, list_user } = req.body;
            try {
                const isValid = yield Conversation_1.ConversationCreateGroupChatSchema.validate({ title, list_user }, {
                    abortEarly: false,
                });
            }
            catch (error) {
                (0, functions_1.throwValidateError)(error, next);
                return;
            }
            try {
                const userInfo = res.locals.decodeToken;
                const { insertId: newIdRoom } = yield this.conversationDao.addNewGroupConversation(title, userInfo.id_user);
                const parseListUser = list_user;
                parseListUser.indexOf(userInfo.id_user) === -1 &&
                    parseListUser.push(userInfo.id_user);
                const data = (0, functions_1.forBulkInsert)(parseListUser.map((id_user) => {
                    return {
                        id_user: id_user,
                    };
                }), newIdRoom.toString());
                yield this.userInConversationDao.addUsersToConversation(data);
                const newConversation = yield this.conversationDao.getConversationById(userInfo.id_user, newIdRoom.toString());
                if (newConversation) {
                    this.emitJoinRoom(req, parseListUser, newConversation);
                    const listUserToConversation = [
                        ...parseListUser.map((id) => this.userLastSeenMessageDao.addUserToRoom(newIdRoom.toString(), id)),
                    ];
                    yield Promise.all([listUserToConversation]);
                }
                res.json({ newRoom: newConversation });
            }
            catch (error) {
                console.log(error);
                (0, functions_1.throwHttpError)(constants_1.DB_ERROR, constants_1.BAD_REQUEST, next);
                return;
            }
        });
    }
    emitJoinRoom(req, listUser, newConversation) {
        const conversationSocket = req.app.get(constants_1.SOCKET_LIST)[constants_1.SOCKET_NAMESPACE.CONVERSATION];
        if (conversationSocket) {
            actions_1.RoomSocketActions.handleRoomGroup(conversationSocket, listUser, newConversation);
        }
    }
    emitNewUsersJoin(req, listNewUser, id_room) {
        try {
            const conversationSocket = req.app.get(constants_1.SOCKET_LIST)[constants_1.SOCKET_NAMESPACE.CONVERSATION];
            if (conversationSocket) {
                actions_1.RoomSocketActions.emitNewUsersJoinRoom(conversationSocket, listNewUser, id_room);
            }
        }
        catch (error) { }
    }
    createPrivateConversation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_friend } = req.body;
            const userInfo = res.locals.decodeToken;
            // prevent same user
            if (userInfo.id_user.toString() === id_friend) {
                (0, functions_1.throwNormalError)("Need different user", next);
                return;
            }
            try {
                const isValid = Conversation_1.ConversationCreatePrivateChatSchema.validate({
                    id_friend,
                }, {
                    abortEarly: false,
                });
                try {
                    const { insertId: newIdRoom } = yield this.conversationDao.addNewPrivateConversation(userInfo.id_user.toString());
                    const data = (0, functions_1.forBulkInsert)([{ id_user: id_friend }, { id_user: userInfo.id_user.toString() }], newIdRoom.toString());
                    yield this.userInConversationDao.addUsersToConversation(data);
                    const newConversation = yield this.conversationDao.getConversationById(userInfo.id_user, newIdRoom.toString());
                    if (newConversation) {
                        const conversationSocket = req.app.get(constants_1.SOCKET_LIST)[constants_1.SOCKET_NAMESPACE.CONVERSATION];
                        if (conversationSocket) {
                            actions_1.RoomSocketActions.joinPrivateRoom(conversationSocket, [userInfo.id_user.toString(), id_friend], newConversation);
                        }
                        const listUserToConversation = [
                            ...[userInfo.id_user.toString(), id_friend].map((id) => this.userLastSeenMessageDao.addUserToRoom(newIdRoom.toString(), id)),
                        ];
                        yield Promise.all([listUserToConversation]);
                    }
                    res.json({ newRoom: newConversation });
                }
                catch (error) { }
            }
            catch (error) {
                (0, functions_1.throwValidateError)(error, next);
                return;
            }
            // Check if a conversation between two user exist
            try {
                const conversation = yield this.userInConversationDao.checkPrivateConversationExist(userInfo.id_user.toString(), id_friend);
                if (conversation) {
                    throw new Error("Exist");
                }
            }
            catch (error) {
                (0, functions_1.throwNormalError)("Conversation exist", next);
            }
            try {
                const { insertId: newIdRoom } = yield this.conversationDao.addNewPrivateConversation(userInfo.id_user.toString());
                const data = (0, functions_1.forBulkInsert)(new Array(id_friend, userInfo.id_user).map((id_user) => {
                    return {
                        id_user: id_user,
                    };
                }), newIdRoom.toString());
                yield this.userInConversationDao.addUsersToConversation(data);
                res.json({ newIdRoom: newIdRoom });
            }
            catch (error) {
                (0, functions_1.throwHttpError)(constants_1.DB_ERROR, constants_1.BAD_REQUEST, next);
            }
        });
    }
    getConversationById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_conversation = null } = req.params;
            const userInfo = res.locals.decodeToken;
            if (!id_conversation) {
                (0, functions_1.throwNormalError)("Conversation required", next);
                return;
            }
            try {
                const conversationInfo = yield this.conversationDao.getConversationById(userInfo.id_user, id_conversation.toString());
                if (!conversationInfo) {
                    res.json({
                        conversationInfo,
                        listUser: null,
                    });
                }
                else {
                    const listUserInRoom = yield this.userInConversationDao.getAllConversationUser(id_conversation.toString());
                    const listUserLastSeenMessage = yield this.userLastSeenMessageDao.getUserLastSeenInRoom(id_conversation.toString());
                    res.json({
                        conversationInfo,
                        listUser: listUserInRoom,
                        lastSeenMessageData: listUserLastSeenMessage,
                    });
                }
            }
            catch (error) {
                (0, functions_1.throwHttpError)(constants_1.DB_ERROR, constants_1.BAD_REQUEST, next);
            }
        });
    }
    getConversations(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userInfo = res.locals.decodeToken;
            try {
                const listConversations = yield this.conversationDao.getConversationByUser(userInfo.id_user.toString());
                res.json({ data: listConversations });
            }
            catch (error) {
                console.log(error);
                (0, functions_1.throwHttpError)(constants_1.DB_ERROR, constants_1.BAD_REQUEST, next);
            }
        });
    }
    addUsersToConversation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id_room, list_user } = req.body;
            const userInfo = res.locals.decodeToken;
            try {
                const isValid = yield Conversation_1.ConversationAddUsersSchema.validate({
                    id_room,
                    list_user,
                });
            }
            catch (error) {
                (0, functions_1.throwValidateError)(error, next);
                return;
            }
            try {
                // const parseListUser: string[] = JSON.parse(list_user);
                const parseListUser = list_user.map((id) => id.toString());
                const listCurrentUserInRoom = yield (yield this.userInConversationDao.getAllConversationUser(id_room)).map((user) => user.id_user.toString());
                // Filter list user
                parseListUser.forEach((userId, index) => {
                    if (listCurrentUserInRoom.indexOf(userId.toString()) !== -1)
                        parseListUser.splice(index, 1);
                });
                console.log("da", parseListUser);
                const data = (0, functions_1.forBulkInsert)(parseListUser.map((id_user) => {
                    return {
                        id_user: id_user,
                    };
                }), id_room.toString());
                yield this.userInConversationDao.addUsersToConversation(data);
                const currentConversation = yield this.conversationDao.getConversationById(userInfo.id_user, id_room);
                if (currentConversation) {
                    const listUserInRoom = yield this.userInConversationDao.getAllConversationUser(id_room);
                    const listNewUser = listUserInRoom.filter((user) => parseListUser.indexOf(user.id_user.toString()) !== -1);
                    // Emit to all user in this room that someone join their room
                    this.emitNewUsersJoin(req, listNewUser, id_room);
                    this.emitJoinRoom(req, parseListUser, currentConversation);
                    const listUserToConversation = [
                        ...parseListUser.map((id) => this.userLastSeenMessageDao.addUserToRoom(currentConversation.id_room.toString(), id)),
                    ];
                    yield Promise.all([listUserToConversation]);
                }
                res.json({
                    message: "Success",
                });
                // listCurrentUserInRoom.forEach((userId))
            }
            catch (error) {
                console.log(error);
                (0, functions_1.throwHttpError)(constants_1.DB_ERROR, constants_1.BAD_REQUEST, next);
            }
        });
    }
}
exports.ConversationController = ConversationController;
