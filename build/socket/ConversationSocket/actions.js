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
const userSocket = {};
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
            userSocket[constants_1.SOCKET_PREFIX.USER + userInfo.id_user] = socket.id;
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
    handleRoomGroup: (namespace, listUser, newConversation) => __awaiter(void 0, void 0, void 0, function* () {
        namespace.sockets.forEach((socket) => {
            const userInfo = socket.data.decode;
            if (listUser.indexOf(userInfo.id_user.toString()) != -1) {
                // Join new room
                socket.join(constants_1.SOCKET_PREFIX.CONVERSATION + newConversation.id_room);
                // update list user and their room
                userInRoom[constants_1.SOCKET_PREFIX.USER + userInfo.id_user].push(constants_1.SOCKET_PREFIX.CONVERSATION + newConversation.id_room);
                // Emit to matched socket to join new room
                namespace
                    .in(socket.id)
                    .emit(constants_1.SOCKET_EMIT_ACTIONS.JOIN_NEW_ROOM, { newConversation });
            }
        });
    }),
    emitNewUsersJoinRoom: (namespace, listNewUser, id_room) => {
        namespace
            .to(constants_1.SOCKET_PREFIX.CONVERSATION + id_room.toString())
            .emit(constants_1.SOCKET_EMIT_ACTIONS.USERS_JOIN_ROOM, { listNewUser });
    },
    joinPrivateRoom: (namespace, listUser, newConversation) => {
        namespace.sockets.forEach((socket) => {
            const userInfo = socket.data.decode;
            if (listUser.indexOf(userInfo.id_user.toString()) != 1) {
                // Join new room
                socket.join(constants_1.SOCKET_PREFIX.CONVERSATION + newConversation.id_room);
                // update list user and their room
                userInRoom[constants_1.SOCKET_PREFIX.USER + userInfo.id_user].push(constants_1.SOCKET_PREFIX.CONVERSATION + newConversation.id_room);
            }
        });
    },
    emitSeenMessageEvent: (namespace, id_conversation, userInfo, id_message) => {
        const { id_user, avatar, name } = userInfo;
        namespace
            .to(constants_1.SOCKET_PREFIX.CONVERSATION + id_conversation.toString())
            .emit(constants_1.SOCKET_EMIT_ACTIONS.EMIT_SEEN_MESSAGE, {
            id_user,
            avatar,
            name,
            id_message,
            id_conversation,
        });
    },
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
            socket.broadcast
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
            socket.broadcast
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
    // joinRoom(namespace:Namespace,id_user:string,id_conversation:string){
    // if(userSocket[SOCKET_PREFIX.USER+id_user])
    // namespace.in(userSocket[SOCKET_PREFIX.USER+id_user]).socketsJoin(SOCKET_PREFIX.CONVERSATION+id_conversation)
    // },
    leaveConversation: () => __awaiter(void 0, void 0, void 0, function* () { }),
};
