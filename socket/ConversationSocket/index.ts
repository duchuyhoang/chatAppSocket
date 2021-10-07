import { Namespace, Socket } from "socket.io";
import {RoomSocketActions} from "./actions";

export const ConversationSocket=(namespace: Namespace)=>{

    namespace.once("connection", async (socket: Socket)=>{
         await RoomSocketActions.initialActions(namespace,socket);
    })

}