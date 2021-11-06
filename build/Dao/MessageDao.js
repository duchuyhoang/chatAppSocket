"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageDao = void 0;
const BaseDao_1 = require("./BaseDao");
const constants_1 = require("../common/constants");
const Message_1 = require("../models/Message");
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
    insertNewIconMessage(newMessage) {
        return new Promise((resolve, reject) => {
            const { id_icon, id_user, id_conversation } = newMessage;
            this.db.query(`INSERT INTO message(id_user,id_conversation,id_icon,createAt,type) VALUES(?,?,?,now(),${constants_1.MESSAGE_TYPE.ICON})`, [id_user, id_conversation, id_icon], (err, result) => {
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
            this.db.query(`SELECT message.id_message,message.content,message.createAt as message_create_at,
        message.id_user,message.delFlag as message_del_flag,
message.id_conversation,message.type,message.updateAt,message.url,message.id_icon,user.email,
user.phone,user.name,user.delFlag,user.avatar,user.createAt,user.sex,user.lastSeen,
icon.iconUrl,icon.delFlag as icon_delFlg,icon.blocksOfWidth,icon.blocksOfHeight,icon.width,
icon.height,icon.totalFrames,icon.createAt as icon_createAt,icon.category as icon_category
FROM message INNER JOIN user ON message.id_user=user.id_user AND id_conversation=?
LEFT JOIN icon ON message.id_icon=icon.id_icon ORDER BY message.id_message DESC;`, [id_conversation], (err, result) => {
                if (err)
                    reject(err);
                const list = result.map((queryMessage) => (0, Message_1.generateMessage)({
                    id_message: queryMessage.id_message,
                    content: queryMessage.content,
                    createAt: queryMessage.message_create_at,
                    id_user: queryMessage.id_user,
                    delFlag: queryMessage.message_del_flag,
                    id_conversation: queryMessage.id_conversation,
                    type: queryMessage.type,
                    userInfo: {
                        id_user: queryMessage.id_user,
                        email: queryMessage.email,
                        phone: queryMessage.phone,
                        name: queryMessage.name,
                        delFlag: queryMessage.delFlag,
                        avatar: queryMessage.avatar,
                        createAt: queryMessage.createAt,
                        sex: queryMessage.sex,
                        lastSeen: queryMessage.lastSeen,
                    },
                    updateAt: queryMessage.updateAt,
                    url: queryMessage.url,
                    id_icon: queryMessage.id_icon,
                    iconUrl: queryMessage.iconUrl,
                    icon_delFlg: queryMessage.icon_delFlg,
                    blocksOfWidth: queryMessage.blocksOfWidth,
                    blocksOfHeight: queryMessage.blocksOfHeight,
                    width: queryMessage.width,
                    height: queryMessage.height,
                    totalFrames: queryMessage.totalFrames,
                    icon_createAt: queryMessage.icon_createAt,
                    icon_category: queryMessage.icon_category,
                }));
                resolve(list);
            });
        });
    }
}
exports.MessageDao = MessageDao;
