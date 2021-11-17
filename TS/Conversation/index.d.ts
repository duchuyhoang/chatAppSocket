import { Maybe } from "yup/lib/types";
import {CONVERSATION_TYPE, DEL_FLAG} from "../../common/constants";

export interface Conversation{
    id_room:int,
    title:string
    type:CONVERSATION_TYPE
    delFlag:DEL_FLAG
    createAt: Maybe<string>
    creator:int,
}


export interface ConversationWithCreatorInfo extends Conversation{
    creator_email:string
    creator_name:string
    creator_avatar:Maybe<string>
    creator_phone:string,
    creator_sex:string,
    last_message:Maybe<string>
    last_message_type:Maybe<number|string>,
    listAvatar:Maybe<string>,
    nextUserName:Maybe<string>,
    nextUserAvatar:Maybe<string>,
    nextUserSex:number,
    message_count:number
}