"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageDao = void 0;
const BaseDao_1 = require("./BaseDao");
const constants_1 = require("../common/constants");
class MessageDao extends BaseDao_1.BaseDao {
    constructor() {
        super(...arguments);
        this.insertNewMessage = () => { };
        // public insertImagesMessage()
    }
    insertNewTextMessage(newMessage) {
        const { content, id_conversation, id_user } = newMessage;
        return new Promise((resolve, reject) => {
            this.db.query(`INSERT INTO message(content,id_user,id_conversation,type,createAt) VALUES(?,?,?,${constants_1.MESSAGE_TYPE.TEXT},now())`, [content, id_user, id_conversation], (err, result) => {
                if (err)
                    reject(err);
                resolve(result);
            });
        });
    }
    insertNewImageMessage(newMessage) {
        return new Promise((resolve, reject) => {
            const { url, id_user, id_conversation } = newMessage;
            this.db.query(`INSERT INTO message(id_user,id_conversation,url,createAt,type) VALUES(?,?,?,now(),${constants_1.MESSAGE_TYPE.IMAGE})`, [id_user, id_conversation, url], (err, result) => {
                if (err)
                    reject(err);
                else
                    resolve(result);
            });
        });
    }
    insertMultipleImageMessage(listImageInfo) {
        return new Promise((resolve, reject) => {
            this.db.query(`INSERT INTO message(id_user,id_conversation,type,url,createAt) VALUES ?`, [listImageInfo], (err, result) => {
                if (err)
                    reject(err);
                resolve(result);
            });
        });
    }
    getMessageByConversation(id_conversation) {
        return new Promise((resolve, reject) => {
            this.db.query(`SELECT message.id_message,message.content,message.createAt as message_create_at,message.id_user,message.delFlag as message_del_flag,
message.id_conversation,message.type,message.updateAt,message.url,message.id_icon,user.email,
user.phone,user.name,user.delFlag,user.avatar,user.createAt,user.sex,user.lastSeen
FROM message INNER JOIN user ON message.id_user=user.id_user AND id_conversation=?`, [id_conversation], (err, result) => {
                if (err)
                    reject(err);
                resolve(result);
            });
        });
    }
}
exports.MessageDao = MessageDao;
