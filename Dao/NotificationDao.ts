import { BaseDao } from "./BaseDao";
import { Notification } from "../models/Notification";
import { NOTIFICATION_TYPE } from "../common/constants";
import { INewFriendRequestNotification } from "../models/Notification";
import { OkPacket } from "mysql";
export class NotificationDao extends BaseDao {
  constructor() {
    super();
  }

  insertNewFriendNotification(payload: INewFriendRequestNotification) {
    const { id_owner, id_receiver, message } = payload;

    return new Promise<OkPacket>((resolve, reject) => {
      this.db.query(
        `INSERT INTO notification(id_owner,id_receiver,message,createAt,type) 
    VALUES(?,?,?,now(),${NOTIFICATION_TYPE.FRIEND_REQUEST})`,
        [id_owner, id_receiver, message],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }

  // getAllNotificationsByUser(id_user:string){
  // return new Promise((resolve, reject)=>{
  // this.db.query()

  // })

  // }
}
