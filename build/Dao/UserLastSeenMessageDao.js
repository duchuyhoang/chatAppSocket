"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLastSeenMessageDao = void 0;
const BaseDao_1 = require("./BaseDao");
const constants_1 = require("../common/constants");
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
    getUserLastSeenInRoom(id_room) {
        return new Promise((resolve, reject) => {
            this.db.query(`
SELECT user_last_seen_message.*,
${constants_1.queryInfoStringWithUser}
 FROM user_last_seen_message INNER JOIN user ON user.id_user=id_user_last_seen WHERE user_last_seen_message.id_room=?;
`, [id_room], (err, result) => {
                if (err)
                    reject(err);
                else
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
