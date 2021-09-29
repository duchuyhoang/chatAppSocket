import { BaseDao } from "./BaseDao";
import Icon from "../models/Icon";
import { DEL_FLAG } from "../common/constants";
import { User } from "../models/User";
export class AuthenticationDao extends BaseDao {
  constructor() {
    super();
  }

  public login(email: string, password: string) {
    return new Promise<User | null>((resolve, reject) => {
      this.db.query(
        `SELECT * FROM user WHERE email=? AND password=? and delFlag=${DEL_FLAG} LIMIT 1`,
        [email, password],
        (err, result) => {
          if (err) return reject(err);
          if (result.length === 0) {
            resolve(null);
          } else {
            const selectedUser: User = result[0];
            resolve(selectedUser);
          }
        }
      );
    });
  }
}
