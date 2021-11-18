"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationDao = void 0;
const BaseDao_1 = require("./BaseDao");
const constants_1 = require("../common/constants");
class NotificationDao extends BaseDao_1.BaseDao {
    constructor() {
        super();
    }
    insertNewFriendRequestNotification(payload) {
        const { id_owner, id_receiver, message } = payload;
        return new Promise((resolve, reject) => {
            this.db.query(`INSERT INTO notification(id_owner,id_receiver,message,createAt,type) 
    VALUES(?,?,?,now(),${constants_1.NOTIFICATION_TYPE.FRIEND_REQUEST})`, [id_owner, id_receiver, message], (err, result) => {
                if (err)
                    reject(err);
                else
                    resolve(result);
            });
        });
    }
    getAllNotificationByUser(id_user) {
        return new Promise((resolve, reject) => {
            this.db.query(`
SELECT notification.*,
ownerTable.email as ownerEmail,ownerTable.phone as ownerPhone,ownerTable.name as ownerName,ownerTable.avatar as ownerAvatar,ownerTable.sex as ownerSex,
receiverTable.email as receiverEmail,receiverTable.phone as receiverPhone,receiverTable.name as receiverName,receiverTable.avatar as receiverAvatar,receiverTable.sex as receiverSex
FROM notification LEFT JOIN user as ownerTable ON notification.id_owner=ownerTable.id_user
LEFT JOIN user as receiverTable ON notification.id_receiver=receiverTable.id_user
WHERE notification.id_receiver=? `, 
            // AND notification.status=${NOTIFICATION_STATUS.PENDING}
            [id_user], (err, result) => {
                if (err)
                    reject(err);
                else
                    resolve(result);
            });
        });
    }
    getSpecificNotification(id_user, id_notification) {
        return new Promise((resolve, reject) => {
            this.db.query(`
SELECT notification.*,
ownerTable.email as ownerEmail,ownerTable.phone as ownerPhone,ownerTable.name as ownerName,ownerTable.avatar as ownerAvatar,ownerTable.sex as ownerSex,
receiverTable.email as receiverEmail,receiverTable.phone as receiverPhone,receiverTable.name as receiverName,receiverTable.avatar as receiverAvatar,receiverTable.sex as receiverSex
FROM notification LEFT JOIN user as ownerTable ON notification.id_owner=ownerTable.id_user
LEFT JOIN user as receiverTable ON notification.id_receiver=receiverTable.id_user
WHERE notification.id_receiver=? AND notification.id_notification=? LIMIT 1`, 
            // AND notification.status=${NOTIFICATION_STATUS.PENDING}
            [id_user, id_notification], (err, result) => {
                console.log(err);
                if (err)
                    reject(err);
                else
                    resolve(result);
            });
        });
    }
    answerFriendRequest(id_user, id_sender, id_notification, status) {
        return new Promise((resolve, reject) => {
            this.db.query(`UPDATE notification SET status=? WHERE id_notification=? AND id_owner=? AND id_receiver=? AND status=${constants_1.NOTIFICATION_STATUS.PENDING}`, [status, id_notification, id_sender, id_user], (err, result) => {
                if (err)
                    reject(err);
                else
                    resolve(result);
            });
        });
    }
}
exports.NotificationDao = NotificationDao;
