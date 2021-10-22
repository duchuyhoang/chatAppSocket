import { BaseDao } from "./BaseDao";
import Icon from "../models/Icon";
import { DEL_FLAG } from "../common/constants";
import { User } from "../models/User";
import {OkPacket} from "mysql";
export class AuthenticationDao extends BaseDao {
  constructor() {
    super();
  }

  public login(email: string, password: string) {
    return new Promise<User | null>((resolve, reject) => {
      this.db.query(
        `SELECT * FROM user WHERE email=? AND password=? and delFlag=${DEL_FLAG.VALID} LIMIT 1`,
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

public checkUserExist(email:string){
  return new Promise<boolean>((resolve, reject) => {
    this.db.query(
      `SELECT * FROM user WHERE email=? and delFlag=${DEL_FLAG.VALID} LIMIT 1`,
      [email],
      (err, result) => {
        if (err) return reject(err);
        if (result.length === 0) {
          resolve(false);
        } else {
          resolve(true);
        }
      }
    );
  });
}


public signup(userInfo:Omit<User,"id_user"|"delFlag"|"createAt"|"lastSeen"> & {password:string}){
  const {email,name,password,avatar=null,phone,sex}=userInfo;
  return new Promise<OkPacket>((resolve, reject) => {
    this.db.query(`INSERT INTO user(email,phone,name,avatar,createAt,password,sex,lastSeen) VALUES(?,?,?,?,now(),?,?,now())`,
    [email,phone,name,avatar,password,sex],(err,result)=>{
      if(err) reject(err);
      else
      resolve(result);
    })
  })
}

public reLogin(id_user:string){
  return new Promise<User | null>((resolve, reject) => {
    this.db.query(
      `SELECT * FROM user WHERE id_user=? and delFlag=${DEL_FLAG.VALID} LIMIT 1`,
      [id_user],
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
