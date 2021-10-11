import { Server as SocketServer, Socket, Namespace } from "socket.io";
import {
  SOCKET_NAMESPACE,
  SOCKET_PREFIX,
  SOCKET_ON_ACTIONS,
} from "../../common/constants";
import { DecodedUser, IFriend } from "../../models/User";
import { UserDao } from "../../Dao/UserDao";
import { resetRoom } from "../../common/socket";
import { UserActions } from "./actions";

interface IFriendOnline extends Omit<IFriend, "password"> {
  online: boolean;
}

type UserListFriend = {
  [id_user: string]: DecodedUser[];
};

export const UserSocket = (namespace: Namespace) => {
  namespace.once("connection", async (socket: Socket) => {
    await UserActions.initialActions(namespace, socket);

   
    // USER_QUIT_APPLICATION

    socket.on(
      SOCKET_ON_ACTIONS.ON_DISCONNECT,
      UserActions.onDisconnect(namespace, socket)
    );

    socket.on("disconnect", () => {
     socket.removeAllListeners();
      //   socket.disconnect();
    });


  });

  //   socket.on("hello",()=>{
  //     console.log("inside");

  // })
};
