import { Namespace, Socket } from "socket.io";
import { SOCKET_EMIT_ACTIONS, SOCKET_ON_ACTIONS } from "../../common/constants";
import { RoomSocketActions } from "./actions";
import { ConversationIsTyping } from "../../models/Conversation";
export const ConversationSocket = (namespace: Namespace) => {
  // namespace.
  namespace
    .off("connection", () => {})
    .on("connection", async (socket: Socket) => {
      await RoomSocketActions.initialActions(namespace, socket);
      namespace.removeAllListeners();
      socket.on("disconnect", () => {
        console.log("dis");
        socket.removeAllListeners("connection");
        socket.off("connection", () => {});
        // socket.off(SOCKET_ON_ACTIONS.ON_TYPING);
        // socket.disconnect();
      });

      // Listen if user is typing
      socket
        .off(SOCKET_ON_ACTIONS.ON_TYPING, () => {})
        .on(SOCKET_ON_ACTIONS.ON_TYPING, (data: ConversationIsTyping) => {
          const { userInfo, id_conversation = "" } = data;
          RoomSocketActions.emitIsTyping(namespace, id_conversation, userInfo,socket);
        });

      socket
        .off(SOCKET_ON_ACTIONS.ON_STOP_TYPING, () => {})
        .on(SOCKET_ON_ACTIONS.ON_STOP_TYPING, (data: ConversationIsTyping) => {
          const {id_conversation } = data;
          RoomSocketActions.onStopTyping(
            namespace,
            socket.data.decode,
            id_conversation,
            socket
          );
        });

      socket.emit(SOCKET_EMIT_ACTIONS.SOCKET_READY);
    });
};
