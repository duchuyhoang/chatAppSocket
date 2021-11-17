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

  public getConversationByUser(id_user: string) {
    return new Promise<ConversationWithCreatorInfo[]>((resolve, reject) => {
      this.db.query(
        `SELECT conversation.*,user.name as creator_name,
        user.email as creator_email,user.avatar as creator_avatar,user.phone as creator_phone,user.sex as creator_sex,
        get_count_message(conversation.id_room) as message_count,get_last_message(conversation.id_room) as last_message,
        get_last_message_type(conversation.id_room) as last_message_type,
        get_next_user_name(conversation.id_room,?,conversation.type) as nextUserName,
        get_next_user_avatar(conversation.id_room,?,conversation.type) as nextUserAvatar,
        get_next_user_sex(conversation.id_room,?,conversation.type) as nextUserSex,
        (SELECT GROUP_CONCAT(user.avatar SEPARATOR "****")  
      FROM user_in_conversation INNER JOIN user
        ON user_in_conversation.id_user=user.id_user WHERE user_in_conversation.id_room=conversation.id_room
        GROUP BY conversation.id_room
        ) as listAvatar
        FROM user_in_conversation 
        INNER JOIN conversation ON user_in_conversation.id_room=conversation.id_room 
        LEFT JOIN user ON conversation.creator=user.id_user
        WHERE conversation.delFlag=${DEL_FLAG.VALID} AND user_in_conversation.id_user=?`,
        [id_user, id_user, id_user, id_user],
        (err, result) => {
          if (err) reject(err);
          else {
            resolve(result);
          }
        }
      );
    });
  }

  public getConversationById(
    id_user: string | number,
    id_conversation: string
  ) {
    return new Promise<ConversationWithCreatorInfo | null>(
      (resolve, reject) => {
        this.db.query(
          `SELECT conversation.*,
          user.name as creator_name,user.email as creator_email,
          user.avatar as creator_avatar,user.phone as creator_phone,user.sex as creator_sex,
get_count_message(conversation.id_room) as message_count,
get_last_message(conversation.id_room) as last_message,
get_last_message_type(conversation.id_room) as last_message_type,
get_next_user_name(conversation.id_room,?,conversation.type) as nextUserName,
get_next_user_avatar(conversation.id_room,?,conversation.type) as nextUserAvatar,
get_next_user_sex(conversation.id_room,?,conversation.type) as nextUserSex,
(SELECT GROUP_CONCAT(user.avatar SEPARATOR "****")  
        FROM user_in_conversation INNER JOIN user
        ON user_in_conversation.id_user=user.id_user WHERE user_in_conversation.id_room=conversation.id_room
        GROUP BY conversation.id_room
        ) as listAvatar
FROM conversation 
INNER JOIN user ON conversation.creator=user.id_user
WHERE conversation.delFlag=${DEL_FLAG.VALID} AND conversation.id_room=? LIMIT 1;`,
          [id_user, id_user,id_user, id_conversation],
          (err, result) => {
            if (err) reject(err);

            if (!result||result?.length === 0) resolve(null);
            else resolve(result[0]);
          }
        );
      }
    );
  }
}
