"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationDao = void 0;
const BaseDao_1 = require("./BaseDao");
const constants_1 = require("../common/constants");
class ConversationDao extends BaseDao_1.BaseDao {
    constructor() {
        super();
    }
    addNewGroupConversation(title, creator) {
        return new Promise((resolve, reject) => {
            this.db.query(`INSERT INTO conversation(title,type,createAt,creator) VALUES(?,${constants_1.CONVERSATION_TYPE.GROUP},now(),?)`, [title, creator], (err, result) => {
                if (err)
                    reject(err);
                resolve(result);
            });
        });
    }
    addNewPrivateConversation(creator) {
        return new Promise((resolve, reject) => {
            this.db.query(`INSERT INTO conversation(type,createAt,creator) VALUES(${constants_1.CONVERSATION_TYPE.SINGLE},now(),?)`, [creator], (err, result) => {
                if (err)
                    reject(err);
                resolve(result);
            });
        });
    }
    getConversationByUser(id_user) {
        return new Promise((resolve, reject) => {
            this.db.query(`SELECT conversation.*,user.name as creator_name,
        user.email as creator_email,user.avatar as creator_avatar,user.phone as creator_phone,user.sex as creator_sex,
        get_count_message(conversation.id_room) as message_count,get_last_message(conversation.id_room) as last_message,
        get_last_message_type(conversation.id_room) as last_message_type,
        get_next_user_name(conversation.id_room,?,conversation.type) as nextUserName,
        (SELECT GROUP_CONCAT(user.avatar SEPARATOR "****")  
        FROM user_in_conversation INNER JOIN user
        ON user_in_conversation.id_user=user.id_user WHERE user_in_conversation.id_room=conversation.id_room
        GROUP BY conversation.id_room
        ) as listAvatar
        FROM user_in_conversation 
        INNER JOIN conversation ON user_in_conversation.id_room=conversation.id_room 
        LEFT JOIN user ON conversation.creator=user.id_user
        WHERE conversation.delFlag=${constants_1.DEL_FLAG.VALID} AND user_in_conversation.id_user=?`, [id_user, id_user], (err, result) => {
                if (err)
                    reject(err);
                else {
                    resolve(result);
                }
            });
        });
    }
    getConversationById(id_user, id_conversation) {
        return new Promise((resolve, reject) => {
            this.db.query(`SELECT conversation.*,
          user.name as creator_name,user.email as creator_email,
          user.avatar as creator_avatar,user.phone as creator_phone,user.sex as creator_sex,
get_count_message(conversation.id_room) as message_count,
get_last_message(conversation.id_room) as last_message,
get_last_message_type(conversation.id_room) as last_message_type,
get_next_user_name(conversation.id_room,?,conversation.type) as nextUserName,
(SELECT GROUP_CONCAT(user.avatar SEPARATOR "****")  
        FROM user_in_conversation INNER JOIN user
        ON user_in_conversation.id_user=user.id_user WHERE user_in_conversation.id_room=conversation.id_room
        GROUP BY conversation.id_room
        ) as listAvatar
FROM conversation 
INNER JOIN user ON conversation.creator=user.id_user
WHERE conversation.delFlag=${constants_1.DEL_FLAG.VALID} AND conversation.id_room=? LIMIT 1;`, [id_user, id_conversation], (err, result) => {
                if (err)
                    reject(err);
                if (result.length === 0)
                    resolve(null);
                else
                    resolve(result[0]);
            });
        });
    }
}
exports.ConversationDao = ConversationDao;
