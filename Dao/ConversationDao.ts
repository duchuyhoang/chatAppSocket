import { BaseDao } from "./BaseDao";
import { UserInConversationDao } from "./UserInConversationDao";
import { Conversation } from "../models/Conversation";
import { CONVERSATION_TYPE, DEL_FLAG } from "../common/constants";
import { forBulkInsert } from "../common/functions";
import { ConversationWithCreatorInfo } from "../TS/Conversation";
import { OkPacket } from "mysql";
export class ConversationDao extends BaseDao {
  constructor() {
    super();
  }

  public addNewGroupConversation(title: string, creator: string) {
    return new Promise<OkPacket>((resolve, reject) => {
      this.db.query(
        `INSERT INTO conversation(title,type,createAt,creator) VALUES(?,${CONVERSATION_TYPE.GROUP},now(),?)`,
        [title, creator],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  }

  public addNewPrivateConversation(creator: string) {
    return new Promise<OkPacket>((resolve, reject) => {
      this.db.query(
        `INSERT INTO conversation(type,createAt,creator) VALUES(${CONVERSATION_TYPE.SINGLE},now(),?)`,
        [creator],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  }

  getConversationByUser(id_user: string) {
    return new Promise<ConversationWithCreatorInfo[]>((resolve, reject) => {
      this.db.query(
        `SELECT conversation.*,
user.email as creator_email,user.avatar as creator_avatar,user.phone as creator_phone 
FROM user_in_conversation 
INNER JOIN conversation ON user_in_conversation.id_room=conversation.id_room 
INNER JOIN user ON conversation.creator=user.id_user
WHERE conversation.delFlag=${DEL_FLAG.VALID} AND (user_in_conversation.id_user=?
OR user_in_conversation.id_user=?)`,
        [id_user, id_user],
        (err, result) => {
          if (err) reject(err);
          else {
            resolve(result);
          }
        }
      );
    });
  }
}
