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
exports.RoomSocketActions = void 0;
const constants_1 = require("../../common/constants");
const ConversationDao_1 = require("../../Dao/ConversationDao");
const userInRoom = {};
exports.RoomSocketActions = {
    initialActions: (namespace, socket) => __awaiter(void 0, void 0, void 0, function* () {
        // getConversationByUser
        const userInfo = socket.data.decode;
        const conversationDao = new ConversationDao_1.ConversationDao();
        // Leave room default
        // await socket.leave(socket.id);
        // resetRoom(socket, socket.id, SOCKET_PREFIX.CONVERSATION + userInfo.id_user);
        try {
            const listConversations = yield conversationDao.getConversationByUser(userInfo.id_user.toString());
            // Specific user in room
            userInRoom[constants_1.SOCKET_PREFIX.USER + userInfo.id_user] = [];
            const rooms = [];
            listConversations.map((conversation) => {
                //  socket.join(
                //   SOCKET_PREFIX.CONVERSATION + conversation.id_room.toString()
                // );
                rooms.push(constants_1.SOCKET_PREFIX.CONVERSATION + conversation.id_room.toString());
                userInRoom[constants_1.SOCKET_PREFIX.USER + userInfo.id_user].push(constants_1.SOCKET_PREFIX.CONVERSATION + conversation.id_room.toString());
            });
            // join rooms
            yield socket.join(rooms);
        }
        catch (error) { }
        // SOCKET_PREFIX
    }),
    joinConversation: (socket, id_conversation) => __awaiter(void 0, void 0, void 0, function* () {
        socket.join(constants_1.SOCKET_PREFIX.CONVERSATION + id_conversation.toString());
    }),
    emitMessageToConversation: (namespace, id_conversation, data) => {
        namespace
            .in(constants_1.SOCKET_PREFIX.CONVERSATION + id_conversation.toString())
            .emit(constants_1.SOCKET_EMIT_ACTIONS.EMIT_MESSAGE, data);
    },
    emitIsTyping: (namespace, id_conversation, user, socket) => {
        // console.log(SOCKET_PREFIX.CONVERSATION + id_conversation.toString());
        // console.log("socket",namespace.sockets);
        if (socket) {
            const { id_user, avatar, email, phone, name } = user;
            socket
                .to(constants_1.SOCKET_PREFIX.CONVERSATION + id_conversation.toString())
                .emit(constants_1.SOCKET_EMIT_ACTIONS.EMIT_IS_TYPING, {
                id_user,
                avatar,
                email,
                phone,
                name,
            });
        }
        else {
            namespace
                .to(constants_1.SOCKET_PREFIX.CONVERSATION + id_conversation.toString())
                .emit(constants_1.SOCKET_EMIT_ACTIONS.EMIT_IS_TYPING, user);
        }
    },
    onStopTyping: (namespace, user, id_conversation, socket) => {
        if (socket) {
            const { id_user, avatar, email, phone, name } = user;
            socket
                .to(constants_1.SOCKET_PREFIX.CONVERSATION + id_conversation.toString())
                .emit(constants_1.SOCKET_EMIT_ACTIONS.EMIT_STOP_TYPING, {
                id_user,
                avatar,
                email,
                phone,
                name,
            });
        }
        else {
            const { id_user, avatar, email, phone, name } = user;
            namespace
                .to(constants_1.SOCKET_PREFIX.CONVERSATION + id_conversation.toString())
                .emit(constants_1.SOCKET_EMIT_ACTIONS.EMIT_STOP_TYPING, {
                id_user,
                avatar,
                email,
                phone,
                name,
            });
        }
    },
    leaveConversation: () => __awaiter(void 0, void 0, void 0, function* () { }),
};
