import { BaseDao } from "./BaseDao";
import { MESSAGE_TYPE, MESSAGE_STATUS } from "../common/constants";
import {
  IInsertIconMessage,
  IInsertTextMessage,
  IInsertImageMessage,
  IQueryMessage,
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
        `SELECT message.id_message,message.content,message.createAt as message_create_at,message.id_user,message.delFlag as message_del_flag,
message.id_conversation,message.type,message.updateAt,message.url,message.id_icon,user.email,
user.phone,user.name,user.delFlag,user.avatar,user.createAt,user.sex,user.lastSeen
FROM message INNER JOIN user ON message.id_user=user.id_user AND id_conversation=?`,
        [id_conversation],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  }

  // public insertImagesMessage()
}
