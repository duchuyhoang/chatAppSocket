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
            this.db.query(`SELECT * FROM user WHERE email=? AND password=? and delFlag=${constants_1.DEL_FLAG} LIMIT 1`, [email, password], (err, result) => {
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
}
exports.AuthenticationDao = AuthenticationDao;
