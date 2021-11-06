import { Namespace, Socket } from "socket.io";
import { SOCKET_ON_ACTIONS } from "../../common/constants";
import { NotificationSocketActions } from "./actions";

export const NotificationSocket = (namespace: Namespace) => {
  namespace.off("connection",()=>{}).on("connection", async (socket: Socket) => {
    await NotificationSocketActions.initialActions(namespace, socket);
// console.log(socket.data);

    socket.on(
      SOCKET_ON_ACTIONS.ON_DISCONNECT,
      NotificationSocketActions.onDisconnect(namespace, socket)
    );

    socket.on("disconnect", () => {
      socket.removeAllListeners();
       //   socket.disconnect();
     });

  });
};
