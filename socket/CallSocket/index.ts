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

type UserSocket = {
  [id_user: string]: string;
};

const userSockets: UserSocket = {};

export const CallSocket = (namespace: Namespace) => {
  namespace
    // .off("connection", () => {})
    .on("connection", (socket: Socket) => {
      // userSockets;

// socket.on("join chat",(data)=>{
//   const {userInfo,id_conversation}=data;

// })


      socket.on(
        SOCKET_ON_ACTIONS.ON_GET_LIST_USER_IN_ROOM,
        async ({ id_conversation }) => {
          const socketList: string[] = [];
          await socket.join(SOCKET_PREFIX.CALL_CHAT + id_conversation);
          const socketSet = await namespace
            .to(SOCKET_PREFIX.CALL_CHAT + id_conversation)
            .allSockets();
          socketSet.forEach((value) => {
            if (value != socket.id) socketList.push(value);
          });

          socket.emit(SOCKET_EMIT_ACTIONS.EMIT_LIST_USER_RESPONSE, {
            socketList,
          });
        }
      );

      // socket.on(
      //   SOCKET_ON_ACTIONS.ON_SENDING_SIGNAL,
      //   async ({ id_room, signal, receiverSockerId }) => {
      //     namespace
      //       .to(receiverSockerId)
      //       .emit(SOCKET_EMIT_ACTIONS.EMIT_SIGNAL_OFFER, { signal });

      //   }
      // );

      // socket.on(
      //   SOCKET_ON_ACTIONS.ON_SEND_OFFER_SIGNAL,
      //   async ({ id_room, signal, receiverSockerId,stream,callerSocketId }) => {
      //     namespace
      //       .to(receiverSockerId)
      //       .emit(SOCKET_EMIT_ACTIONS.EMIT_SIGNAL_OFFER, { signal,callerSocketId,stream });
      //   }
      // );

      // socket.on(
      //   SOCKET_ON_ACTIONS.ON_SEND_ANSWER_SIGNAL,
      //   ({receiverSocketId,signal,callerSocketId})=>{
      //     namespace.to(receiverSocketId).emit(SOCKET_EMIT_ACTIONS.EMIT_SIGNAL_ANSWER,{signal,callerSocketId})
      //   }
      // )

      socket.on(
        "request call",
        ({
          peerId,
          streamPeerId,
          callerSocketId,
          receiverSocket,
          userInfo,
          mic,
          video,
          type,
        }) => {
          namespace.to(receiverSocket).emit("user joined", {
            callerSocketId,
            peerId,
            streamPeerId,
            userInfo,
            type,
            mic,
            video,
          });
        }
      );

      socket.on("socketLeave", ({ id_room, socketId }) => {
        namespace
          .to(SOCKET_PREFIX.CALL_CHAT + id_room)
          .emit("user left", { socketId });
      });

      socket.on("make change", ({ id_room, socketId, mic, video }) => {
        namespace
          .to(SOCKET_PREFIX.CALL_CHAT + id_room)
          .emit("something change", { id_room, socketId, mic, video });
      });

      socket.on("start share screen", async ({ id_room }) => {
        const socketList: string[] = [];
        const socketSet = await namespace
          .to(SOCKET_PREFIX.CALL_CHAT + id_room)
          .allSockets();
        socketSet.forEach((value) => {
          if (value != socket.id) socketList.push(value);
        });

        socket.emit("share to", { socketList });

        // namespace.to(SOCKET_PREFIX.CALL_CHAT + id_room).emit("someone share screen",{stream,socketId})
      });

      socket.on(
        "request share screen",
        ({
          peerId,
          callerSocketId,
          receiverSocket,
          userInfo,
          mic,
          video,
          type,
        }) => {
          namespace.to(receiverSocket).emit("user share screen", {
            peerId,
            callerSocketId,
            userInfo,
            mic,
            video,
            type,
          });
        }
      );

      socket.on(
        "accept share screen",
        ({ callerSocketId, socketId, peerId }) => {
          namespace
            .to(callerSocketId)
            .emit("user accepted share screen", { socketId, peerId });
        }
      );

      socket.on("stop share", ({ socketId, id_room }) => {
        socket.broadcast
          .to(SOCKET_PREFIX.CALL_CHAT + id_room)
          .emit("user stop share", { socketId });
      });

      socket.on("disconnect", () => {
        // console.log("diss");
      });
    });
};
