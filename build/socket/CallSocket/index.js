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
        .off("connection", () => { })
        .on("connection", (socket) => {
        socket.on(constants_1.SOCKET_ON_ACTIONS.ON_GET_LIST_USER_IN_ROOM, (id_room) => __awaiter(void 0, void 0, void 0, function* () {
            const socketList = [];
            const socketSet = yield namespace
                .to(constants_1.SOCKET_PREFIX.CALL + id_room)
                .allSockets();
            socketSet.forEach((value) => {
                socketList.push(value);
            });
            socket.emit(constants_1.SOCKET_EMIT_ACTIONS.EMIT_LIST_USER_RESPONSE, {
                socketList,
            });
        }));
        socket.on(constants_1.SOCKET_ON_ACTIONS.ON_SENDING_SIGNAL, ({ id_room, signal, receiverSockerId }) => __awaiter(void 0, void 0, void 0, function* () {
            namespace.to(receiverSockerId).emit(constants_1.SOCKET_EMIT_ACTIONS.EMIT_SIGNAL_OFFER, { signal });
            // await socket.join(SOCKET_PREFIX.CALL + id_room);
            // socket
            //   .to(SOCKET_PREFIX.CALL + id_room)
            //   .emit(SOCKET_EMIT_ACTIONS.EMIT_SIGNAL_OFFER, { signal });
        }));
    });
};
exports.CallSocket = CallSocket;
