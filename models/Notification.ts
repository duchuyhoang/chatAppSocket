import { Maybe } from "yup/lib/types";
import {NOTIFICATION_TYPE} from "../common/constants";

export interface Notification{
   id_notification:number,
   id_owner:number,
   message:string,
   type: typeof NOTIFICATION_TYPE[keyof typeof NOTIFICATION_TYPE],
   id_receiver:number,
   seenAt:Maybe<String>,
   createAt:Maybe<String>
}


