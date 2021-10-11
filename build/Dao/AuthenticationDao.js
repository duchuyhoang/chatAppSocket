"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationDao = void 0;
const BaseDao_1 = require("./BaseDao");
const constants_1 = require("../common/constants");
class AuthenticationDao extends BaseDao_1.BaseDao {
    constructor() {
        super();
    }
    login(email, password) {
        return new Promise((resolve, reject) => {
            this.db.query(`SELECT * FROM user WHERE email=? AND password=? and delFlag=${constants_1.DEL_FLAG.VALID} LIMIT 1`, [email, password], (err, result) => {
                if (err)
                    return reject(err);
                if (result.length === 0) {
                    resolve(null);
                }
                else {
                    const selectedUser = result[0];
                    resolve(selectedUser);
                }
            });
        });
    }
    checkUserExist(email) {
        return new Promise((resolve, reject) => {
            this.db.query(`SELECT * FROM user WHERE email=? and delFlag=${constants_1.DEL_FLAG.VALID} LIMIT 1`, [email], (err, result) => {
                if (err)
                    return reject(err);
                if (result.length === 0) {
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            });
        });
    }
    signup(userInfo) {
        const { email, name, password, avatar = null, phone, sex } = userInfo;
        return new Promise((resolve, reject) => {
            this.db.query(`INSERT INTO user(email,phone,name,avatar,createAt,password,sex,lastSeen) VALUES(?,?,?,?,now(),?,?,now())`, [email, phone, name, avatar, password, sex], (err, result) => {
                if (err)
                    reject(err);
                else
                    resolve(result);
            });
        });
    }
}
exports.AuthenticationDao = AuthenticationDao;
