import { Maybe } from "yup/lib/types";
import {NOTIFICATION_STATUS, NOTIFICATION_TYPE} from "../common/constants";
import { DecodedUser } from "./User";

export interface Notification{
   id_notification:number,
   id_owner:number,
   message:string,
   type: typeof NOTIFICATION_TYPE[keyof typeof NOTIFICATION_TYPE],
   id_receiver:number,
   seenAt:Maybe<String>,
   createAt:Maybe<String>,
   status:NOTIFICATION_STATUS
}

export interface ISendNotification{
   id_owner:number,
   type: typeof NOTIFICATION_TYPE[keyof typeof NOTIFICATION_TYPE],
   createAt:string,
   data:any
}

export interface ICallVideoStartData{
   idRoom:string|number,
   callUser:DecodedUser,
   newIdRoom:string
}


export interface INewFriendRequestNotification{
   id_owner:string,
   id_receiver:string,
   message:string
}
