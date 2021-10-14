"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationDao = void 0;
const BaseDao_1 = require("./BaseDao");
const constants_1 = require("../common/constants");
class NotificationDao extends BaseDao_1.BaseDao {
    constructor() {
        super();
    }
    insertNewFriendNotification(payload) {
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
}
exports.NotificationDao = NotificationDao;
