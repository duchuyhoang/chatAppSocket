import { Maybe } from "yup/lib/types";
import { USER_IN_ROOM_STATUS } from "../common/constants";
import {User} from "./User";

export interface UserInConversation{
    id:number;
    id_user:number;
    id_room:number;
    status:USER_IN_ROOM_STATUS,
}

export type IUserInConversationQuery=Omit<UserInConversation,"id_user"|"status">& User & {userInRoomStatus:USER_IN_ROOM_STATUS}