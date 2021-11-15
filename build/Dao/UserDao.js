"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDao = void 0;
const constants_1 = require("../common/constants");
const BaseDao_1 = require("./BaseDao");
const queryInfoString = "id_user,email,phone,name,delFlag,avatar,createAt,sex,lastSeen";
class UserDao extends BaseDao_1.BaseDao {
    constructor() {
        super();
    }
    searchUserByEmailOrPhone(keyword, id_user) {
        return new Promise((resolve, reject) => {
            const query = this.db.query(`
        SELECT selected.*,user_has_friend.status as friendStatus,check_can_make_friend_request(?,selected.id_user) as can_make_friend_request 
        FROM (SELECT ${queryInfoString} FROM user WHERE (name LIKE CONCAT('%', ?,  '%') OR email LIKE CONCAT('%', ?,  '%') OR phone LIKE CONCAT('%', ?,  '%')) AND delFlag=${constants_1.DEL_FLAG.VALID} AND id_user!=?)
        as selected LEFT JOIN user_has_friend ON (selected.id_user=user_has_friend.id_user or selected.id_user=user_has_friend.id_friend) 
        AND(user_has_friend.id_user=? OR user_has_friend.id_friend=?) 
        `, [id_user, keyword, keyword, keyword, id_user, id_user, id_user, id_user, id_user], (err, result) => {
                if (err)
                    reject(err);
                else
                    resolve(result.map((_a) => {
                        var { password } = _a, rest = __rest(_a, ["password"]);
                        return Object.assign({}, rest);
                    }));
            });
        });
    }
    getListFriend(id) {
        return new Promise((resolve, reject) => {
            this.db.query(`SELECT ${constants_1.queryInfoStringWithUser},user_has_friend.status as friendShipStatus,user_has_friend.updateAt FROM user INNER JOIN user_has_friend ON user.id_user=user_has_friend.id_friend 
AND user_has_friend.id_user=? AND status=${constants_1.FRIEND_STATUS.FRIEND} AND delFlag=${constants_1.DEL_FLAG.VALID} UNION
SELECT ${constants_1.queryInfoStringWithUser},user_has_friend.status as friendShipStatus,user_has_friend.updateAt FROM user INNER JOIN user_has_friend ON user.id_user=user_has_friend.id_user 
AND user_has_friend.id_friend=? AND status=${constants_1.FRIEND_STATUS.FRIEND} AND delFlag=${constants_1.DEL_FLAG.VALID}
`, [id, id], (err, result) => {
                if (err)
                    reject(err);
                resolve(result);
            });
        });
    }
    updateLastSeen(id_user) {
        return new Promise((resolve, reject) => {
            this.db.query("UPDATE user SET lastSeen=now() WHERE id_user=?", [id_user], (err, result) => {
                if (err)
                    reject(err);
                else
                    resolve(result);
            });
        });
    }
    getFriendStatusBetween(id_user, id_friend) {
        return new Promise((resolve, reject) => {
            this.db.query(`SELECT status FROM user_has_friend WHERE (id_user=? AND id_friend=?) OR (id_user=? AND id_friend=?)`, [id_user, id_friend, id_friend, id_user], (err, result) => {
                if (err)
                    reject(err);
                if (result.length === 0)
                    resolve(constants_1.FRIEND_STATUS.STRANGE);
                else
                    resolve(result[result.length - 1].status || constants_1.FRIEND_STATUS.STRANGE);
            });
        });
    }
    getUserInfoById(id_user, id_friend) {
        return new Promise((resolve, reject) => {
            this.db.query(`
        SELECT selected.*,user_has_friend.status as friendStatus,check_can_make_friend_request(?,selected.id_user) as can_make_friend_request 
        FROM (SELECT ${queryInfoString} FROM user WHERE delFlag=${constants_1.DEL_FLAG.VALID} AND id_user=?)
        as selected LEFT JOIN user_has_friend ON (selected.id_user=user_has_friend.id_user or selected.id_user=user_has_friend.id_friend) 
        AND(user_has_friend.id_user=?) LIMIT 1`, [id_user, id_friend, id_user], (err, result) => {
                if (err)
                    reject(err);
                else
                    resolve(result[0] || null);
            });
        });
    }
    updateUser(payload) {
        const { id_user } = payload, rest = __rest(payload, ["id_user"]);
        return new Promise((resolve, reject) => {
            this.db.query(`UPDATE user SET ? WHERE id_user=?`, [rest, id_user], (err, result) => {
                if (err)
                    reject(err);
                else {
                    resolve(result);
                }
            });
        });
    }
    getCurrentUser(id_user) {
        return new Promise((resolve, reject) => {
            this.db.query(`
       SELECT ${queryInfoString} FROM user WHERE delFlag=${constants_1.DEL_FLAG.VALID} AND id_user=? LIMIT 1`, [id_user], (err, result) => {
                if (err)
                    reject(err);
                else
                    resolve(result[0] || null);
            });
        });
    }
    insertNewStatusBetween(id_user, id_friend, status) {
        return new Promise((resolve, reject) => {
            this.db.query(`
      INSERT INTO user_has_friend(id_user,id_friend,status) VALUES(?,?,?)
     `, [id_user, id_friend, status], (err, result) => {
                if (err)
                    reject(err);
                else
                    resolve(result[0] || null);
            });
        });
    }
}
exports.UserDao = UserDao;
