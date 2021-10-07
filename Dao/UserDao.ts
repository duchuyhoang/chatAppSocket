import { DEL_FLAG, FRIEND_STATUS } from "../common/constants";
import { User, IFriend } from "../models/User";
import { BaseDao } from "./BaseDao";

export class UserDao extends BaseDao {
  constructor() {
    super();
  }

  public searchUserByEmailOrPhone(email: string | null, phone: string | null) {
    return new Promise<Omit<User, "password">>((resolve, reject) => {
      this.db.query(
        `SELECT * FROM user WHERE email LIKE CONCAT('%', ?,  '%') OR phone LIKE CONCAT('%', ?,  '%') AND delFlag=${DEL_FLAG.VALID}`,
        [email, phone],
        (err, result) => {
          if (err) reject(err);
          else
            resolve(
              result.map(({ password, ...rest }: User) => {
                return { ...rest };
              })
            );
        }
      );
    });
  }

  public getListFriend(id: string) {
    return new Promise<IFriend[]>((resolve, reject) => {
      this.db.query(
        `SELECT user.*,user_has_friend.status as friendShipStatus,user_has_friend.updateAt FROM user INNER JOIN user_has_friend ON user.id_user=user_has_friend.id_friend 
AND user_has_friend.id_user=? AND status=${FRIEND_STATUS.FRIEND} AND delFlag=${DEL_FLAG.VALID} UNION
SELECT user.*,user_has_friend.status as friendShipStatus,user_has_friend.updateAt FROM user INNER JOIN user_has_friend ON user.id_user=user_has_friend.id_user 
AND user_has_friend.id_friend=? AND status=${FRIEND_STATUS.FRIEND} AND delFlag=${DEL_FLAG.VALID}
`,
        [id, id],
        (err, result) => {
          if (err) reject(err);
          resolve(result);
        }
      );
    });
  }

  public updateLastSeen(id_user: string) {
    return new Promise((resolve, reject) => {
      this.db.query(
        "UPDATE user SET lastSeen=now() WHERE id_user=?",
        [id_user],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }
}
