import { CONVERSATION_TYPE } from "../common/constants";
import { DecodedUser } from "./User";

export interface Conversation{
id_room:number;
title:string;
type:CONVERSATION_TYPE,
delFlag:number,
createAt:Date,
}

export interface ConversationIsTyping{
id_conversation:string,
userInfo:DecodedUser
}