import {
  DEL_FLAG,
  FRIEND_STATUS,
  USER_IN_ROOM_STATUS,
  CONVERSATION_TYPE,
} from "../common/constants";
import { Conversation } from "../models/Conversation";
import { BaseDao } from "./BaseDao";
import { UserInConversation } from "../models/UserInConversation";
export class UserInConversationDao extends BaseDao {
  constructor() {
    super();
  }

  getConversationByUser(id_user: string, id_room: string) {
    return new Promise<UserInConversation[]>((resolve, reject) => {
      this.db.query(
        `SELECT * FROM user_in_conversation WHERE id_user=? and id_room=? AND status=${USER_IN_ROOM_STATUS.NORMAL}`,
        [id_user, id_room],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }

  checkPrivateConversationExist(id_user: string, id_friend: string) {
    return new Promise<Conversation | null>((resolve, reject) => {
      this.db.query(
        `
    SELECT conversation.* FROM user_in_conversation 
    INNER JOIN conversation ON user_in_conversation.id_room=conversation.id_room 
    WHERE conversation.delFlag=${DEL_FLAG.VALID} AND (user_in_conversation.id_user=? 
    OR user_in_conversation.id_user=?) AND conversation.type=${CONVERSATION_TYPE.SINGLE} 
    GROUP BY conversation.id_room HAVING COUNT(*)=2    
    `,
        [id_user, id_friend],
        (err, result) => {
          if (err) reject(err);
          else {
            if (result.length >= 1) {
              resolve(result[0]);
            } else {
              resolve(null);
            }
          }
        }
      );
    });
  }

  addUserToConversation(id_room: string, id_user: string) {
    return new Promise((resolve, reject) => {
      this.db.query(
        `INSERT INTO user_in_conversation(id_user,id_room) VALUES(?,?)`,
        [id_user, id_room],
        (err, result) => {
          if (err) reject(err);
          else {
            resolve(result);
          }
        }
      );
    });
  }

  addUsersToConversation(data: (string | number)[][]) {
    // Bulk insert here
    return new Promise((resolve, reject) => {
      this.db.query(
        `INSERT INTO user_in_conversation(id_room,id_user) VALUES ?`,
        [data],
        (err, result) => {
          if (err) reject(err);
          else {
            resolve(result);
          }
        }
      );
    });
  }

  getAllConversationUser(id_room: string) {
    return new Promise<UserInConversation[]>((resolve, reject) => {
      this.db.query(
        `SELECT * FROM user_in_conversation WHERE id_room=? AND status=${USER_IN_ROOM_STATUS.NORMAL}`,
        [id_room],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }
}
