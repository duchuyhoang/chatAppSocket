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
exports.UserSocket = void 0;
const constants_1 = require("../../common/constants");
const actions_1 = require("./actions");
const UserSocket = (namespace) => {
    namespace.once("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
        yield actions_1.UserActions.initialActions(namespace, socket);
        // USER_QUIT_APPLICATION
        socket.on(constants_1.SOCKET_ON_ACTIONS.ON_DISCONNECT, actions_1.UserActions.onDisconnect(namespace, socket));
        socket.on("disconnect", () => {
            socket.removeAllListeners();
            //   socket.disconnect();
        });
    }));
    //   socket.on("hello",()=>{
    //     console.log("inside");
    // })
};
exports.UserSocket = UserSocket;
