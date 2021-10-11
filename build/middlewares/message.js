"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMessageInput = void 0;
const Message_1 = require("../validations/Message");
const UserInConversationDao_1 = require("../Dao/UserInConversationDao");
const functions_1 = require("../common/functions");
const constants_1 = require("../common/constants");
const validateMessageInput = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { type, id_conversation, content } = req.body;
    const userInfo = res.locals.decodeToken;
    const userInConversationDao = new UserInConversationDao_1.UserInConversationDao();
    try {
        const isValid = Message_1.SendMessageSchema.validate({
            type,
            id_conversation,
            content,
        });
    }
    catch (error) {
        (0, functions_1.throwValidateError)(error, next);
        return;
    }
    //   Check user belong to this conversation
    const userInConversation = yield userInConversationDao.getConversationByUser(((_a = userInfo.id_user) === null || _a === void 0 ? void 0 : _a.toString()) || "", id_conversation || "");
    if (userInConversation.length === 0) {
        res.status(constants_1.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
    }
    next();
    // const listUser=await userInConversationDao.
});
exports.validateMessageInput = validateMessageInput;
