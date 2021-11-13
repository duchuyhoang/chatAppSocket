import { OkPacket } from "mysql";
import { Maybe } from "yup/lib/types";
import { DEL_FLAG, FRIEND_STATUS,queryInfoStringWithUser } from "../common/constants";
import { User, IFriend, IUpdateUser,IUserWithFriendshipStatus, DecodedUser } from "../models/User";
import { BaseDao } from "./BaseDao";

const queryInfoString =
  "id_user,email,phone,name,delFlag,avatar,createAt,sex,lastSeen";

export class UserDao extends BaseDao {
  constructor() {
    super();
  }

  public searchUserByEmailOrPhone(keyword: Maybe<string>, id_user: string) {
    return new Promise<
    IUserWithFriendshipStatus[]
    >((resolve, reject) => {
      const query = this.db.query(
        `
        SELECT selected.*,user_has_friend.status as friendStatus,check_can_make_friend_request(?,selected.id_user) as can_make_friend_request 
        FROM (SELECT ${queryInfoString} FROM user WHERE (email LIKE CONCAT('%', ?,  '%') OR phone LIKE CONCAT('%', ?,  '%')) AND delFlag=${DEL_FLAG.VALID} AND id_user!=?)
        as selected LEFT JOIN user_has_friend ON (selected.id_user=user_has_friend.id_user or selected.id_user=user_has_friend.id_friend) 
        AND(user_has_friend.id_user=? OR user_has_friend.id_friend=?) 
        `,
        [id_user, keyword, keyword, id_user, id_user, id_user, id_user,id_user],
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
        `SELECT ${queryInfoStringWithUser},user_has_friend.status as friendShipStatus,user_has_friend.updateAt FROM user INNER JOIN user_has_friend ON user.id_user=user_has_friend.id_friend 
AND user_has_friend.id_user=? AND status=${FRIEND_STATUS.FRIEND} AND delFlag=${DEL_FLAG.VALID} UNION
SELECT ${queryInfoStringWithUser},user_has_friend.status as friendShipStatus,user_has_friend.updateAt FROM user INNER JOIN user_has_friend ON user.id_user=user_has_friend.id_user 
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

  public getFriendStatusBetween(id_user: string, id_friend: string) {
    return new Promise<FRIEND_STATUS>((resolve, reject) => {
      this.db.query(
        `SELECT status FROM user_has_friend WHERE (id_user=? AND id_friend=?) OR (id_user=? AND id_friend=?)`,
        [id_user, id_friend, id_friend, id_user],
        (err, result) => {
          if (err) reject(err);
          if (result.length === 0) resolve(FRIEND_STATUS.STRANGE);
          else
            resolve(result[result.length - 1].status || FRIEND_STATUS.STRANGE);
        }
      );
    });
  }

  public getUserInfoById(id_user: string,id_friend:string) {
    return new Promise<IUserWithFriendshipStatus|null>((resolve, reject) => {
      this.db.query(
        `
        SELECT selected.*,user_has_friend.status as friendStatus,check_can_make_friend_request(?,selected.id_user) as can_make_friend_request 
        FROM (SELECT ${queryInfoString} FROM user WHERE delFlag=${DEL_FLAG.VALID} AND id_user=?)
        as selected LEFT JOIN user_has_friend ON (selected.id_user=user_has_friend.id_user or selected.id_user=user_has_friend.id_friend) 
        AND(user_has_friend.id_user=?) LIMIT 1`,
        [id_user, id_friend, id_user],
        (err, result)=>{
          if(err) reject(err);
          else resolve(result[0]||null);
        }
      );
    });
  }

  public updateUser(payload: Partial<IUpdateUser>) {
    const { id_user, ...rest } = payload;
    return new Promise<OkPacket>((resolve, reject) => {
      this.db.query(
        `UPDATE user SET ? WHERE id_user=?`,
        [rest, id_user],
        (err, result) => {
          if (err) reject(err);
          else {
            resolve(result);
          }
        }
      );
    });
  }
  public getCurrentUser(id_user:string){
    return new Promise<DecodedUser>((resolve, reject) => {
      this.db.query(
        `
       SELECT ${queryInfoString} FROM user WHERE delFlag=${DEL_FLAG.VALID} AND id_user=? LIMIT 1`,
        [id_user],
        (err, result)=>{
          if(err) reject(err);
          else resolve(result[0]||null);
        }
      );
    });
  }

public insertNewStatusBetween(id_user:string,id_friend:string,status:FRIEND_STATUS){
  return new Promise<any>((resolve, reject) => {
    this.db.query(
      `
      INSERT INTO user_has_friend(id_user,id_friend,status) VALUES(?,?,?)
     `,
      [id_user,id_friend,status],
      (err, result)=>{
        if(err) reject(err);
        else resolve(result[0]||null);
      }
    );
  });
}

}
