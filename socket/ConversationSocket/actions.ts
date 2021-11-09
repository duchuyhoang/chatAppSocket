import { Namespace, Socket } from "socket.io";
import {
  SOCKET_PREFIX,
  SOCKET_EMIT_ACTIONS,
  SOCKET_ON_ACTIONS,
  SOCKET_NAMESPACE,
} from "../../common/constants";
import { DecodedUser } from "../../models/User";
import { ConversationDao } from "../../Dao/ConversationDao";
import { ConversationWithCreatorInfo } from "../../TS/Conversation";
import { resetRoom } from "../../common/socket";
import { IEmitMessage } from "../../models/Message";
import { ConversationIsTyping } from "../../models/Conversation";
import { UserInConversation } from "../../models/UserInConversation";

type UserInRoom = {
  [id_user: string]: string[];
};

type UserSocket = {
  [id_user: string]: string;
};

const userInRoom: UserInRoom = {};
const userSocket: UserSocket = {};
export const RoomSocketActions = {
  initialActions: async (namespace: Namespace, socket: Socket) => {
    // getConversationByUser
    const userInfo: DecodedUser = socket.data.decode;
    const conversationDao: ConversationDao = new ConversationDao();
    // Leave room default
    // await socket.leave(socket.id);
    // resetRoom(socket, socket.id, SOCKET_PREFIX.CONVERSATION + userInfo.id_user);
    try {
      const listConversations = await conversationDao.getConversationByUser(
        userInfo.id_user.toString()
      );

      // Specific user in room
      userInRoom[SOCKET_PREFIX.USER + userInfo.id_user] = [];
      userSocket[SOCKET_PREFIX.USER + userInfo.id_user] = socket.id;
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

      // join rooms
      await socket.join(rooms);
    } catch (error) {}

    // SOCKET_PREFIX
  },

  joinConversation: async (socket: Socket, id_conversation: string) => {
    socket.join(SOCKET_PREFIX.CONVERSATION + id_conversation.toString());
  },

  handleRoomGroup: async (
    namespace: Namespace,
    listUser: string[],
    newConversation: ConversationWithCreatorInfo
  ) => {
    namespace.sockets.forEach((socket: Socket) => {
      const userInfo: DecodedUser = socket.data.decode;
      if (listUser.indexOf(userInfo.id_user.toString()) != 1) {
        // Join new room
        socket.join(SOCKET_PREFIX.CONVERSATION + newConversation.id_room);
        // update list user and their room
        userInRoom[SOCKET_PREFIX.USER + userInfo.id_user].push(
          SOCKET_PREFIX.CONVERSATION + newConversation.id_room
        );

        // Emit to matched socket to join new room
        namespace
          .in(socket.id)
          .emit(SOCKET_EMIT_ACTIONS.JOIN_NEW_ROOM, newConversation);
      }
    });
  },

  emitNewUsersJoinRoom: (
    namespace: Namespace,
    listNewUser: UserInConversation[],
    id_room: string
  ) => {
    namespace
      .to(SOCKET_PREFIX.CONVERSATION + id_room.toString())
      .emit(SOCKET_EMIT_ACTIONS.USERS_JOIN_ROOM, { listNewUser });
  },

  joinPrivateRoom: (
    namespace: Namespace,
    listUser: string[],
    newConversation: ConversationWithCreatorInfo
  ) => {
    namespace.sockets.forEach((socket: Socket) => {
      const userInfo: DecodedUser = socket.data.decode;
      if (listUser.indexOf(userInfo.id_user.toString()) != 1) {
        // Join new room
        socket.join(SOCKET_PREFIX.CONVERSATION + newConversation.id_room);
        // update list user and their room
        userInRoom[SOCKET_PREFIX.USER + userInfo.id_user].push(
          SOCKET_PREFIX.CONVERSATION + newConversation.id_room
        );
      }
    });
  },

  emitSeenMessageEvent: (
    namespace: Namespace,
    id_conversation: string,
    userInfo: DecodedUser,
    id_message: string
  ) => {
    const { id_user, avatar, name } = userInfo;
    namespace
      .to(SOCKET_PREFIX.CONVERSATION + id_conversation.toString())
      .emit(SOCKET_EMIT_ACTIONS.EMIT_SEEN_MESSAGE, {
        id_user,
        avatar,
        name,
        id_message,
        id_conversation,
      });
  },

  emitMessageToConversation: (
    namespace: Namespace,
    id_conversation: string,
    data: IEmitMessage
  ) => {
    namespace
      .in(SOCKET_PREFIX.CONVERSATION + id_conversation.toString())
      .emit(SOCKET_EMIT_ACTIONS.EMIT_MESSAGE, data);
  },

  emitIsTyping: (
    namespace: Namespace,
    id_conversation: string,
    user: DecodedUser,
    socket?: Socket
  ) => {
    // console.log(SOCKET_PREFIX.CONVERSATION + id_conversation.toString());
    // console.log("socket",namespace.sockets);

    if (socket) {
      const { id_user, avatar, email, phone, name } = user;
      socket.broadcast
        .to(SOCKET_PREFIX.CONVERSATION + id_conversation.toString())
        .emit(SOCKET_EMIT_ACTIONS.EMIT_IS_TYPING, {
          id_user,
          avatar,
          email,
          phone,
          name,
        });
    } else {
      namespace
        .to(SOCKET_PREFIX.CONVERSATION + id_conversation.toString())
        .emit(SOCKET_EMIT_ACTIONS.EMIT_IS_TYPING, user);
    }
  },

  onStopTyping: (
    namespace: Namespace,
    user: DecodedUser,
    id_conversation: string,
    socket?: Socket
  ) => {
    if (socket) {
      const { id_user, avatar, email, phone, name } = user;
      socket.broadcast
        .to(SOCKET_PREFIX.CONVERSATION + id_conversation.toString())
        .emit(SOCKET_EMIT_ACTIONS.EMIT_STOP_TYPING, {
          id_user,
          avatar,
          email,
          phone,
          name,
        });
    } else {
      const { id_user, avatar, email, phone, name } = user;
      namespace
        .to(SOCKET_PREFIX.CONVERSATION + id_conversation.toString())
        .emit(SOCKET_EMIT_ACTIONS.EMIT_STOP_TYPING, {
          id_user,
          avatar,
          email,
          phone,
          name,
        });
    }
  },

  // joinRoom(namespace:Namespace,id_user:string,id_conversation:string){

  // if(userSocket[SOCKET_PREFIX.USER+id_user])
  // namespace.in(userSocket[SOCKET_PREFIX.USER+id_user]).socketsJoin(SOCKET_PREFIX.CONVERSATION+id_conversation)
  // },

  leaveConversation: async () => {},
};
