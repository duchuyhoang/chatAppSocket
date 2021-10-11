import { Server as SocketServer, Socket, Namespace } from "socket.io";
import {
  SOCKET_NAMESPACE,
  SOCKET_PREFIX,
  SOCKET_EMIT_ACTIONS,
} from "../../common/constants";
import { DecodedUser, IFriend } from "../../models/User";
import { UserDao } from "../../Dao/UserDao";
import { resetRoom } from "../../common/socket";
interface IFriendOnline extends Omit<IFriend, "password"> {
  online: boolean;
}
type UserOneline = {
  [id_user: string]: DecodedUser;
};

const userOnline: UserOneline = {};

export const UserActions = {
  initialActions: async (namespace: Namespace, socket: Socket) => {
    const userDao = new UserDao();
    const userInfo: DecodedUser = socket.data.decode;
    // Join room with prefix and user id
    resetRoom(socket, socket.id, SOCKET_PREFIX.USER + userInfo.id_user);
    userOnline[SOCKET_PREFIX.USER + userInfo.id_user] = userInfo;

    const listUsers = namespace.adapter.rooms;

    try {
      const listFriend = await userDao.getListFriend(
        userInfo.id_user.toString()
      );
      const listFriendReturn: IFriendOnline[] = listFriend.map(
        (friend: IFriend) => {
          const { password, ...rest } = friend;

          // emit to all of this user friends that he or she is online
          if (userOnline[SOCKET_PREFIX.USER + friend.id_user]) {
            namespace
              .to(SOCKET_PREFIX.USER + friend.id_user)
              .emit(SOCKET_EMIT_ACTIONS.USER_JOIN_APPLICATION, {
                user: userInfo.id_user,
              });
          }

          return {
            ...rest,
            online: userOnline[SOCKET_PREFIX.USER + friend.id_user]
              ? true
              : false,
          };
        }
      );
      socket.emit(SOCKET_EMIT_ACTIONS.SOCKET_READY);
      // Pass list friend to current user
      socket.emit(SOCKET_EMIT_ACTIONS.LIST_FRIEND, { data: listFriendReturn });
    } catch (err) {
      socket.emit(SOCKET_EMIT_ACTIONS.LIST_FRIEND, { data: [] });
    }
  },

  onDisconnect: (namespace: Namespace, socket: Socket) => {
    const userDao = new UserDao();
    const userInfo: DecodedUser = socket.data.decode;

    return async (socket: Socket) => {
      try {
        const listFriend = await userDao.getListFriend(
          userInfo.id_user.toString()
        );
        // emit to this user friends that he/she left
        listFriend.map((friend: DecodedUser) => {
          friend.id_user.toString() !== userInfo.id_user.toString() &&
            namespace
              .to(SOCKET_PREFIX.USER + friend.id_user)
              .emit(SOCKET_EMIT_ACTIONS.USER_QUIT_APPLICATION, {
                user: friend.id_user,
              });
        });

        socket.leave(SOCKET_PREFIX.USER + userInfo.id_user);

        //   update lastSeen
        await userDao.updateLastSeen(userInfo.id_user.toString());
        //   Delete user from user online
        delete userOnline[SOCKET_PREFIX.USER + userInfo.id_user];
      } catch (err) {}
    };
  },

  checkUserOnline(id_user: string) {
    return userOnline[SOCKET_PREFIX.USER + id_user] ? true : false;
  },
};
