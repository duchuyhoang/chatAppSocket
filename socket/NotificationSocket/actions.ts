import { Namespace, Socket } from "socket.io";
import { DecodedUser } from "../../models/User";
import { NotificationDao } from "../../Dao/NotificationDao";
import { resetRoom } from "../../common/socket";
import {
  MESSAGE_TYPE,
  NOTIFICATION_TYPE,
  SOCKET_EMIT_ACTIONS,
  SOCKET_PREFIX,
} from "../../common/constants";
import {ISendNotification} from "../../models/Notification";
type USER_ENABLE_NOTIFICATION = {
  [key: string]: DecodedUser;
};

const userNotificationList: USER_ENABLE_NOTIFICATION = {};

export const NotificationSocketActions = {
  initialActions: async (namespace: Namespace, socket: Socket) => {
    const userDao = new NotificationDao();
    const userInfo: DecodedUser = socket.data.decode;

    await resetRoom(socket, socket.id, SOCKET_PREFIX.NOTIFICATION + userInfo.id_user);
    userNotificationList[SOCKET_PREFIX.NOTIFICATION + userInfo.id_user] =
      userInfo;  
    socket.emit(SOCKET_EMIT_ACTIONS.SOCKET_READY);
  },
  onDisconnect: (namespace: Namespace, socket: Socket) => {
    const userDao = new NotificationDao();
    const userInfo: DecodedUser = socket.data.decode;
    return async (socket: Socket) => {
      delete userNotificationList[
        SOCKET_PREFIX.NOTIFICATION + userInfo.id_user
      ];
    };
  },

  async emitNotification(namespace: Namespace, room: string, data: ISendNotification) {    
    namespace.in(room).emit(SOCKET_EMIT_ACTIONS.EMIT_NOTIFICATION, data);
  },
  
  // handleFriendRequestSuccess(namespace:Namespace,)
};
