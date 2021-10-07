import { Maybe } from "yup/lib/types";
import { DEL_FLAG, MESSAGE_TYPE } from "../common/constants";

export interface Message {
  id_message: string;
  content: string;
  createAt: string;
  id_user: string;
  delFlag: DEL_FLAG;
  id_conversation: string;
  type: MESSAGE_TYPE;
  updateAt:Maybe<string>;
  url:Maybe<string>;
  id_icon: Maybe<string>;
}

export interface IInsertTextMessage{
    content: string;
    id_user: string;
    id_conversation: string;
}

export interface IInsertImageMessage{
    url:string;
    id_user: string;
    id_conversation: string;
}


export interface IInsertIconMessage{
  id_icon:string;
  id_user: string;
  id_conversation: string;
}
