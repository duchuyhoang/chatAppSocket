import { Server as SocketServer, Socket } from "socket.io";
import { SOCKET_NAMESPACE } from "../common/constants";
import {bindSocketData} from "../middlewares/authenticate";
import { User,DecodedUser } from "../models/User";
import {UserSocket} from "./UserSocket";
import {ConversationSocket} from "./ConversationSocket";
export const socketList:any = {};

export const socketManager = (io: SocketServer,decodeData:DecodedUser) => {
  
  socketList[SOCKET_NAMESPACE.CONVERSATION]=io.of(SOCKET_NAMESPACE.CONVERSATION).use(bindSocketData(decodeData));
  socketList[SOCKET_NAMESPACE.USER]=io.of(SOCKET_NAMESPACE.USER).use(bindSocketData(decodeData));


  // UserSocket(socketList[SOCKET_NAMESPACE.USER]);
  ConversationSocket(socketList[SOCKET_NAMESPACE.CONVERSATION]);

// Initial action here

  return socketList
};
