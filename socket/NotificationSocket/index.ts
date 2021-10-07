import { Namespace, Socket } from "socket.io";
import {SOCKET_ON_ACTIONS} from "../../common/constants";
import {NotificationSocketActions} from "./actions";


export const NotificationSocket = (namespace: Namespace) => {
    namespace.once("connection", async (socket: Socket) => {
        socket.on(
            SOCKET_ON_ACTIONS.ON_DISCONNECT,
            NotificationSocketActions.onDisconnect(namespace, socket)
          );
    })



}