"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInConversationDao = void 0;
const constants_1 = require("../common/constants");
const BaseDao_1 = require("./BaseDao");
class UserInConversationDao extends BaseDao_1.BaseDao {
    constructor() {
        super();
    }
    getConversationByUser(id_user, id_room) {
        return new Promise((resolve, reject) => {
            this.db.query(`SELECT * FROM user_in_conversation WHERE id_user=? and id_room=? AND status=${constants_1.USER_IN_ROOM_STATUS.NORMAL}`, [id_user, id_room], (err, result) => {
                if (err)
                    reject(err);
                else
                    resolve(result);
            });
        });
    }
    checkPrivateConversationExist(id_user, id_friend) {
        return new Promise((resolve, reject) => {
            this.db.query(`
    SELECT conversation.* FROM user_in_conversation 
    INNER JOIN conversation ON user_in_conversation.id_room=conversation.id_room 
    WHERE conversation.delFlag=${constants_1.DEL_FLAG.VALID} AND (user_in_conversation.id_user=? 
    OR user_in_conversation.id_user=?) AND conversation.type=${constants_1.CONVERSATION_TYPE.SINGLE} 
    GROUP BY conversation.id_room HAVING COUNT(*)=2    
    `, [id_user, id_friend], (err, result) => {
                if (err)
                    reject(err);
                else {
                    if (result.length >= 1) {
                        resolve(result[0]);
                    }
                    else {
                        resolve(null);
                    }
                }
            });
        });
    }
    addUserToConversation(id_room, id_user) {
        return new Promise((resolve, reject) => {
            this.db.query(`INSERT INTO user_in_conversation(id_user,id_room) VALUES(?,?)`, [id_user, id_room], (err, result) => {
                if (err)
                    reject(err);
                else {
                    resolve(result);
                }
            });
        });
    }
    addUsersToConversation(data) {
        // Bulk insert here
        return new Promise((resolve, reject) => {
            this.db.query(`INSERT INTO user_in_conversation(id_room,id_user) VALUES ?`, [data], (err, result) => {
                if (err)
                    reject(err);
                else {
                    resolve(result);
                }
            });
        });
    }
    getAllConversationUser(id_room) {
        return new Promise((resolve, reject) => {
            this.db.query(`SELECT * FROM user_in_conversation WHERE id_room=? AND status=${constants_1.USER_IN_ROOM_STATUS.NORMAL}`, [id_room], (err, result) => {
                if (err)
                    reject(err);
                else
                    resolve(result);
            });
        });
    }
}
exports.UserInConversationDao = UserInConversationDao;
