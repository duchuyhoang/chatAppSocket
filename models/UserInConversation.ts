import { Maybe } from "yup/lib/types";
import { USER_IN_ROOM_STATUS } from "../common/constants";


export interface UserInConversation{
    id_user:number;
    id_room:number;
    status:USER_IN_ROOM_STATUS,
    
}