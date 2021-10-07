import { Namespace, Socket } from "socket.io";
import { SOCKET_PREFIX,SOCKET_EMIT_ACTIONS } from "../../common/constants";
import { DecodedUser } from "../../models/User";
import { ConversationDao } from "../../Dao/ConversationDao";
import { ConversationWithCreatorInfo } from "../../TS/Conversation";
import { resetRoom } from "../../common/socket";

type UserInRoom = {
  [id_user: string]: string[];
};

const userInRoom: UserInRoom = {};

export const RoomSocketActions = {
  initialActions: async (namespace: Namespace, socket: Socket) => {
    // getConversationByUser
    const userInfo: DecodedUser = socket.data.decode;
    const conversationDao: ConversationDao = new ConversationDao();
    // Leave room default
    socket.leave(socket.id);
    // resetRoom(socket, socket.id, SOCKET_PREFIX.CONVERSATION + userInfo.id_user);
    try {
      const listConversations = await conversationDao.getConversationByUser(
        userInfo.id_user.toString()
      );

      // Specific user in room
      userInRoom[SOCKET_PREFIX.USER + userInfo.id_user] = [];
      const rooms: string[] = [];
      listConversations.map((conversation: ConversationWithCreatorInfo) => {
        //  socket.join(
        //   SOCKET_PREFIX.CONVERSATION + conversation.id_room.toString()
        // );
        rooms.push(
          SOCKET_PREFIX.CONVERSATION + conversation.id_room.toString()
        );
        userInRoom[SOCKET_PREFIX.USER + userInfo.id_user].push(
          SOCKET_PREFIX.CONVERSATION + conversation.id_room.toString()
        );
      });

      await socket.join(rooms);
      socket.emit(SOCKET_EMIT_ACTIONS.SOCKET_READY)
      
    } catch (error) {}

    // SOCKET_PREFIX
  },

  joinConversation: async (socket: Socket, id_conversation: string) => {
    socket.join(SOCKET_PREFIX.CONVERSATION + id_conversation.toString());
  },

  leaveConversation: async () => {},
};
