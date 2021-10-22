"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLastSeenMessageDao = void 0;
const BaseDao_1 = require("./BaseDao");
class UserLastSeenMessageDao extends BaseDao_1.BaseDao {
    addUserToRoom(id_room, id_user) {
        return new Promise((resolve, reject) => {
            this.db.query(`CALL add_user_seen_last_message(?,?,@result);`, [id_user, id_room], (err, result) => {
                if (err)
                    reject(err);
                resolve(result);
            });
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
    updateUserLastSeenTime(id_room, id_user, id_message) {
        return new Promise((resolve, reject) => {
            this.db.query(`UPDATE user_last_seen_message SET seenAt=now(),id_message_last_seen=? WHERE id_user_last_seen=? AND id_room=?`, [id_message, id_user, id_room], (err, result) => {
                if (err)
                    reject(err);
                else {
                    resolve(result);
                }
            });
        });
    }
}
exports.UserLastSeenMessageDao = UserLastSeenMessageDao;
