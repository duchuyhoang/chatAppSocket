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
exports.ConversationSocket = void 0;
const constants_1 = require("../../common/constants");
const actions_1 = require("./actions");
const ConversationSocket = (namespace) => {
    // namespace.
    namespace
        .off("connection", () => { })
        .on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
        yield actions_1.RoomSocketActions.initialActions(namespace, socket);
        // console.log(namespace._e);
        namespace.removeAllListeners();
        socket.on("disconnect", () => {
            console.log("dis");
            socket.removeAllListeners("connection");
            socket.off("connection", () => { });
            // console.log("refresh");
            // socket.off(SOCKET_ON_ACTIONS.ON_TYPING);
            // socket.disconnect();
        });
        // Listen if user is typing
        socket
            .off(constants_1.SOCKET_ON_ACTIONS.ON_TYPING, () => { })
            .on(constants_1.SOCKET_ON_ACTIONS.ON_TYPING, (data) => {
            const { userInfo, id_conversation = "" } = data;
            actions_1.RoomSocketActions.emitIsTyping(namespace, id_conversation, userInfo, socket);
        });
        socket
            .off(constants_1.SOCKET_ON_ACTIONS.ON_STOP_TYPING, () => { })
            .on(constants_1.SOCKET_ON_ACTIONS.ON_STOP_TYPING, (data) => {
            const { id_conversation } = data;
            actions_1.RoomSocketActions.onStopTyping(namespace, socket.data.decode, id_conversation, socket);
        });
        socket.emit(constants_1.SOCKET_EMIT_ACTIONS.SOCKET_READY);
    }));
};
exports.ConversationSocket = ConversationSocket;
