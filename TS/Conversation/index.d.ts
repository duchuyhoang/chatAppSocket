import { Maybe } from "yup/lib/types";
import {CONVERSATION_TYPE, DEL_FLAG} from "../../common/constants";

export interface Conversation{
    id_room:int,
    title:string
    type:CONVERSATION_TYPE
    delFlag:DEL_FLAG
    createAt: Maybe<string>
    creator:int
}


export interface ConversationWithCreatorInfo extends Conversation{
    creator_email:string
    creator_avatar:Maybe<string>
    creator_phone:string
}