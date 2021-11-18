import { BaseDao } from "./BaseDao";
import { Notification } from "../models/Notification";
import { NOTIFICATION_TYPE, NOTIFICATION_STATUS } from "../common/constants";
import { INewFriendRequestNotification } from "../models/Notification";
import { OkPacket } from "mysql";
export class NotificationDao extends BaseDao {
  constructor() {
    super();
  }

  insertNewFriendRequestNotification(payload: INewFriendRequestNotification) {
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

  public getAllNotificationByUser(id_user: string) {
    return new Promise<Notification>((resolve, reject) => {
      this.db.query(
        `
SELECT notification.*,
ownerTable.email as ownerEmail,ownerTable.phone as ownerPhone,ownerTable.name as ownerName,ownerTable.avatar as ownerAvatar,ownerTable.sex as ownerSex,
receiverTable.email as receiverEmail,receiverTable.phone as receiverPhone,receiverTable.name as receiverName,receiverTable.avatar as receiverAvatar,receiverTable.sex as receiverSex
FROM notification LEFT JOIN user as ownerTable ON notification.id_owner=ownerTable.id_user
LEFT JOIN user as receiverTable ON notification.id_receiver=receiverTable.id_user
WHERE notification.id_receiver=? `,
        // AND notification.status=${NOTIFICATION_STATUS.PENDING}
        [id_user],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }

  public getSpecificNotification(id_user: string, id_notification: string) {
    return new Promise<Notification>((resolve, reject) => {
      this.db.query(
        `
SELECT notification.*,
ownerTable.email as ownerEmail,ownerTable.phone as ownerPhone,ownerTable.name as ownerName,ownerTable.avatar as ownerAvatar,ownerTable.sex as ownerSex,
receiverTable.email as receiverEmail,receiverTable.phone as receiverPhone,receiverTable.name as receiverName,receiverTable.avatar as receiverAvatar,receiverTable.sex as receiverSex
FROM notification LEFT JOIN user as ownerTable ON notification.id_owner=ownerTable.id_user
LEFT JOIN user as receiverTable ON notification.id_receiver=receiverTable.id_user
WHERE notification.id_receiver=? AND notification.id_notification=? LIMIT 1`,
        // AND notification.status=${NOTIFICATION_STATUS.PENDING}
        [id_user, id_notification],
        (err, result) => {
          console.log(err);
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }

  public answerFriendRequest(
    id_user:string,
    id_sender:string,
    id_notification:string,
    status:NOTIFICATION_STATUS
  ) {
    return new Promise<OkPacket>((resolve, reject) => {
      this.db.query(
        `UPDATE notification SET status=? WHERE id_notification=? AND id_owner=? AND id_receiver=? AND status=${NOTIFICATION_STATUS.PENDING}`,
        [status,id_notification,id_sender,id_user],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }
}
