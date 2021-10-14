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
exports.generateMessage = void 0;
const generateMessage = (data) => {
    const { content = null, updateAt = null, url = null, id_icon = null, createAt, delFlag, userInfo, id_user } = data, rest = __rest(data, ["content", "updateAt", "url", "id_icon", "createAt", "delFlag", "userInfo", "id_user"]);
    const { id_user: id_User } = userInfo, userInfoRest = __rest(userInfo, ["id_user"]);
    return Object.assign(Object.assign(Object.assign({}, rest), { updateAt,
        url,
        id_icon,
        content, message_del_flag: data.delFlag, message_create_at: data.createAt, id_user: id_user.toString() }), userInfoRest);
};
exports.generateMessage = generateMessage;
