import {Socket} from "socket.io"


export const resetRoom=(socket:Socket,oldRoom:string,newRoom:string)=>{
socket.leave(oldRoom);
socket.join(newRoom);
}