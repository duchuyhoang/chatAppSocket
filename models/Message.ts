import { Maybe } from "yup/lib/types";
import { DEL_FLAG, MESSAGE_TYPE } from "../common/constants";
import { DecodedUser } from "./User";

export interface Message {
  id_message: string;
  content: Maybe<string>;
  createAt: string;
  id_user: string;
  delFlag: DEL_FLAG;
  id_conversation: string;
  type: MESSAGE_TYPE;
  updateAt: Maybe<string>;
  url: Maybe<string>;
  id_icon?: Maybe<string>;
}

interface IQueryMessageIcon {
  id_icon?: Maybe<string>;
  iconUrl: Maybe<string>;
  icon_delFlg: Maybe<number | string>;
  blocksOfWidth: Maybe<number>;
  blocksOfHeight: Maybe<number>;
  width: Maybe<number>;
  height: Maybe<number>;
  totalFrames: Maybe<number>;
  icon_createAt: Maybe<string>;
  icon_category: Maybe<number | string>;
}

export interface ICreateMessage {
  id_message: string;
  content?: string;
  createAt: string;
  id_user: string;
  delFlag: DEL_FLAG;
  id_conversation: string;
  type: MESSAGE_TYPE;
  userInfo: DecodedUser;
  updateAt?: string;
  url?: Maybe<string>;
  id_icon?: Maybe<string>;
  iconUrl?: Maybe<string>;
  icon_delFlg?: Maybe<number | string>;
  blocksOfWidth?: Maybe<number>;
  blocksOfHeight?: Maybe<number>;
  width?: Maybe<number>;
  height?: Maybe<number>;
  totalFrames?: Maybe<number>;
  icon_createAt?: Maybe<string>;
  icon_category?: Maybe<number | string>;
}

export const generateMessage = (data: ICreateMessage): IQueryMessage => {
  const {
    content = null,
    updateAt = null,
    url = null,
    id_icon = null,
    iconUrl = null,
    icon_delFlg = null,
    blocksOfWidth = null,
    blocksOfHeight = null,
    width = null,
    height = null,
    totalFrames = null,
    icon_createAt = null,
    icon_category = null,
    createAt,
    delFlag,
    userInfo,
    id_user,
    ...rest
  } = data;
  const { id_user: id_User, ...userInfoRest } = userInfo;
  return {
    ...rest,
    updateAt,
    url,
    id_icon,
    content,
    message_del_flag: data.delFlag,
    message_create_at: data.createAt,
    id_user: id_user.toString(),
    icon: {
      id_icon,
      iconUrl,
      icon_delFlg,
      blocksOfWidth,
      blocksOfHeight,
      width,
      height,
      totalFrames,
      icon_createAt,
      icon_category,
    },
    ...userInfoRest,
  };
};

export type IQueryMessage = Omit<Message, "createAt" | "delFlag"> & {
  message_create_at: string;
  message_del_flag: DEL_FLAG;
  icon: IQueryMessageIcon;
} & Omit<DecodedUser, "id_user">;

export interface IInsertTextMessage {
  content: string;
  id_user: string;
  id_conversation: string;
}

export interface IInsertImageMessage {
  url: string;
  id_user: string;
  id_conversation: string;
}

export interface IInsertIconMessage {
  id_icon: string;
  id_user: string;
  id_conversation: string;
}

export interface IEmitMessage {
  id_owner: string;
  messageType: MESSAGE_TYPE;
  createAt: string;
  data: any;
}
