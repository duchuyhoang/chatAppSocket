import { OkPacket } from "mysql";
import { BaseDao } from "./BaseDao";
import { DEL_FLAG, queryInfoStringWithUser } from "../common/constants";

export class UserLastSeenMessageDao extends BaseDao {
  public addUserToRoom(id_room: string, id_user: string) {
    return new Promise((resolve, reject) => {
      this.db.query(
        `CALL add_user_seen_last_message(?,?,@result);`,
        [id_user, id_room],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  }

  public getUserLastSeenInRoom(id_room: string) {
    return new Promise((resolve, reject) => {
      this.db.query(
        `
SELECT user_last_seen_message.*,
${queryInfoStringWithUser}
 FROM user_last_seen_message INNER JOIN user ON user.id_user=id_user_last_seen WHERE user_last_seen_message.id_room=?;
`,
        [id_room],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }

  // public addUsersToRoom(id_room: string,listUser:any){
  //     return new Promise((resolve, reject) => {
  //         this.db.query(
  //           `CALL add_user_seen_last_message(?,?,@result);SELECT @result as insert_result;`,
  //           [id_user, id_room],
  //           (err, result) => {
  //             if (err) reject(err);
  //             resolve(result);
  //           }
  //         );
  //       });
  // },

  public updateUserLastSeenTime(
    id_room: string,
    id_user: string,
    id_message: string
  ) {
    return new Promise<OkPacket>((resolve, reject) => {
      this.db.query(
        `UPDATE user_last_seen_message SET seenAt=now(),id_message_last_seen=? WHERE id_user_last_seen=? AND id_room=?`,
        [id_message, id_user, id_room],
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
