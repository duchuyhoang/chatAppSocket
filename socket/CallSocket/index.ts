import { Namespace, Socket } from "socket.io";
import {
  SOCKET_EMIT_ACTIONS,
  SOCKET_ON_ACTIONS,
  SOCKET_PREFIX,
} from "../../common/constants";
import { CallSocketActions } from "./actions";

type CallConversationType = {
  [id_room: string]: string[];
};

export const CallSocket = (namespace: Namespace) => {
  namespace
    .off("connection", () => {})
    .on("connection", (socket: Socket) => {
      socket.on(SOCKET_ON_ACTIONS.ON_GET_LIST_USER_IN_ROOM, async (id_room) => {
        const socketList: string[] = [];
        const socketSet = await namespace
          .to(SOCKET_PREFIX.CALL + id_room)
          .allSockets();
        socketSet.forEach((value) => {
          socketList.push(value);
        });

        socket.emit(SOCKET_EMIT_ACTIONS.EMIT_LIST_USER_RESPONSE, {
          socketList,
        });
      });

      socket.on(
        SOCKET_ON_ACTIONS.ON_SENDING_SIGNAL,
        async ({ id_room, signal,receiverSockerId }) => {
          namespace.to(receiverSockerId).emit(SOCKET_EMIT_ACTIONS.EMIT_SIGNAL_OFFER, { signal })
          // await socket.join(SOCKET_PREFIX.CALL + id_room);
          // socket
          //   .to(SOCKET_PREFIX.CALL + id_room)
          //   .emit(SOCKET_EMIT_ACTIONS.EMIT_SIGNAL_OFFER, { signal });
        }
      );
    });
};
