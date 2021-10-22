import { Namespace, Server as SocketServer, Socket } from "socket.io";
import { SOCKET_NAMESPACE } from "../common/constants";
import { bindSocketData } from "../middlewares/authenticate";
import { User, DecodedUser } from "../models/User";
import { UserSocket } from "./UserSocket";
import { ConversationSocket } from "./ConversationSocket";
import { NotificationSocket } from "./NotificationSocket";
import {CallSocket} from "./CallSocket";
export const socketList: {[key:string]:Namespace} = {};

export const socketManager = (io: SocketServer, decodeData: DecodedUser) => {
  socketList[SOCKET_NAMESPACE.CONVERSATION] = io
    .of(SOCKET_NAMESPACE.CONVERSATION)
    .use(bindSocketData(decodeData));
  socketList[SOCKET_NAMESPACE.USER] = io
    .of(SOCKET_NAMESPACE.USER)
    .use(bindSocketData(decodeData));
  socketList[SOCKET_NAMESPACE.NOTIFICATION] = io
    .of(SOCKET_NAMESPACE.NOTIFICATION)
    .use(bindSocketData(decodeData));

  // socketList[SOCKET_NAMESPACE.CALL] = io.of(SOCKET_NAMESPACE.CALL);

  UserSocket(socketList[SOCKET_NAMESPACE.USER]);
  ConversationSocket(socketList[SOCKET_NAMESPACE.CONVERSATION]);
  NotificationSocket(socketList[SOCKET_NAMESPACE.NOTIFICATION]);
  // Initial action here

  return socketList;
};

export const SocketWithoutAuthenticate=(io: SocketServer)=>{
  socketList[SOCKET_NAMESPACE.CALL_CHAT] = io.of(SOCKET_NAMESPACE.CALL_CHAT);
  CallSocket(socketList[SOCKET_NAMESPACE.CALL_CHAT]);
}