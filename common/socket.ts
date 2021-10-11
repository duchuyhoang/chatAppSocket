import {Socket} from "socket.io"


export const  resetRoom=async (socket:Socket,oldRoom:string,newRoom:string)=>{
await socket.leave(oldRoom);
await socket.join(newRoom);
}