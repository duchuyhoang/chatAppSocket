import { BaseDao } from "./BaseDao";
import { MESSAGE_TYPE, MESSAGE_STATUS } from "../common/constants";
import {
  IInsertIconMessage,
  IInsertTextMessage,
  IInsertImageMessage,
  IQueryMessage,
  generateMessage,
} from "../models/Message";
import { OkPacket } from "mysql";

export class MessageDao extends BaseDao {
  public insertNewMessage = () => {};

  public insertNewTextMessage(newMessage: IInsertTextMessage) {
    const { content, id_conversation, id_user } = newMessage;

    return new Promise<OkPacket>((resolve, reject) => {
      this.db.query(
        `INSERT INTO message(content,id_user,id_conversation,type,createAt) VALUES(?,?,?,${MESSAGE_TYPE.TEXT},now())`,
        [content, id_user, id_conversation],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  }

  public insertNewImageMessage(newMessage: IInsertImageMessage) {
    return new Promise<OkPacket>((resolve, reject) => {
      const { url, id_user, id_conversation } = newMessage;
      this.db.query(
        `INSERT INTO message(id_user,id_conversation,url,createAt,type) VALUES(?,?,?,now(),${MESSAGE_TYPE.IMAGE})`,
        [id_user, id_conversation, url],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }

  public insertNewIconMessage(newMessage: IInsertIconMessage) {
    return new Promise<OkPacket>((resolve, reject) => {
      const { id_icon, id_user, id_conversation } = newMessage;
      this.db.query(
        `INSERT INTO message(id_user,id_conversation,id_icon,createAt,type) VALUES(?,?,?,now(),${MESSAGE_TYPE.ICON})`,
        [id_user, id_conversation, id_icon],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }

  public insertMultipleImageMessage(listImageInfo: any[][]) {
    return new Promise<OkPacket>((resolve, reject) => {
      this.db.query(
        `INSERT INTO message(id_user,id_conversation,type,url,createAt) VALUES ?`,
        [listImageInfo],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  }

  public getMessageByConversation(id_conversation: string) {
    return new Promise<IQueryMessage[]>((resolve, reject) => {
      this.db.query(
        `SELECT message.id_message,message.content,message.createAt as message_create_at,
        message.id_user,message.delFlag as message_del_flag,
message.id_conversation,message.type,message.updateAt,message.url,message.id_icon,user.email,
user.phone,user.name,user.delFlag,user.avatar,user.createAt,user.sex,user.lastSeen,
icon.iconUrl,icon.delFlag as icon_delFlg,icon.blocksOfWidth,icon.blocksOfHeight,icon.width,
icon.height,icon.totalFrames,icon.createAt as icon_createAt,icon.category as icon_category
FROM message INNER JOIN user ON message.id_user=user.id_user AND id_conversation=?
LEFT JOIN icon ON message.id_icon=icon.id_icon ORDER BY message.id_message DESC;`,
        [id_conversation],
        (err, result) => {
          if (err) reject(err);

          const list:IQueryMessage[] = result.map((queryMessage: any) =>
            generateMessage({
              id_message: queryMessage.id_message,
              content: queryMessage.content,
              createAt: queryMessage.message_create_at,
              id_user: queryMessage.id_user,
              delFlag: queryMessage.message_del_flag,
              id_conversation: queryMessage.id_conversation,
              type: queryMessage.type,
              userInfo: {
                id_user: queryMessage.id_user,
                email: queryMessage.email,
                phone: queryMessage.phone,
                name: queryMessage.name,
                delFlag: queryMessage.delFlag,
                avatar: queryMessage.avatar,
                createAt: queryMessage.createAt,
                sex: queryMessage.sex,
                lastSeen: queryMessage.lastSeen,
              },
              updateAt: queryMessage.updateAt,
              url: queryMessage.url,
              id_icon: queryMessage.id_icon,
              iconUrl: queryMessage.iconUrl,
              icon_delFlg: queryMessage.icon_delFlg,
              blocksOfWidth: queryMessage.blocksOfWidth,
              blocksOfHeight: queryMessage.blocksOfHeight,
              width: queryMessage.width,
              height: queryMessage.height,
              totalFrames: queryMessage.totalFrames,
              icon_createAt: queryMessage.icon_createAt,
              icon_category: queryMessage.icon_category,
            })
          );
          resolve(list);
        }
      );
    });
  }

  // public insertImagesMessage()
}
