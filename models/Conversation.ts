import { CONVERSATION_TYPE } from "../common/constants";


export interface Conversation{
id_room:number;
title:string;
type:CONVERSATION_TYPE,
delFlag:number,
createAt:Date,
}