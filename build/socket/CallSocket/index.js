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
exports.CallSocket = void 0;
const constants_1 = require("../../common/constants");
const CallSocket = (namespace) => {
    namespace
        // .off("connection", () => {})
        .on("connection", (socket) => {
        socket.on(constants_1.SOCKET_ON_ACTIONS.ON_GET_LIST_USER_IN_ROOM, ({ id_conversation }) => __awaiter(void 0, void 0, void 0, function* () {
            const socketList = [];
            yield socket.join(constants_1.SOCKET_PREFIX.CALL_CHAT + id_conversation);
            const socketSet = yield namespace
                .to(constants_1.SOCKET_PREFIX.CALL_CHAT + id_conversation)
                .allSockets();
            socketSet.forEach((value) => {
                if (value != socket.id)
                    socketList.push(value);
            });
            socket.emit(constants_1.SOCKET_EMIT_ACTIONS.EMIT_LIST_USER_RESPONSE, {
                socketList,
            });
        }));
        // socket.on(
        //   SOCKET_ON_ACTIONS.ON_SENDING_SIGNAL,
        //   async ({ id_room, signal, receiverSockerId }) => {
        //     namespace
        //       .to(receiverSockerId)
        //       .emit(SOCKET_EMIT_ACTIONS.EMIT_SIGNAL_OFFER, { signal });
        //   }
        // );
        // socket.on(
        //   SOCKET_ON_ACTIONS.ON_SEND_OFFER_SIGNAL,
        //   async ({ id_room, signal, receiverSockerId,stream,callerSocketId }) => {
        //     namespace
        //       .to(receiverSockerId)
        //       .emit(SOCKET_EMIT_ACTIONS.EMIT_SIGNAL_OFFER, { signal,callerSocketId,stream });    
        //   }
        // );
        // socket.on(
        //   SOCKET_ON_ACTIONS.ON_SEND_ANSWER_SIGNAL,
        //   ({receiverSocketId,signal,callerSocketId})=>{
        //     namespace.to(receiverSocketId).emit(SOCKET_EMIT_ACTIONS.EMIT_SIGNAL_ANSWER,{signal,callerSocketId})
        //   }
        // )
        socket.on("request call", ({ peerId, callerSocketId, receiverSocket, userInfo }) => {
            namespace.to(receiverSocket).emit("user joined", { callerSocketId, peerId, userInfo });
        });
        socket.on("socketLeave", ({ id_room, socketId }) => {
            namespace.to(constants_1.SOCKET_PREFIX.CALL_CHAT + id_room).emit("user left", { socketId });
        });
        socket.on("make change", ({ id_room, socketId }) => {
            namespace.to(constants_1.SOCKET_PREFIX.CALL_CHAT + id_room).emit("something change", { id_room, socketId });
        });
        socket.on("disconnect", () => {
            // console.log("diss");
        });
    });
};
exports.CallSocket = CallSocket;
