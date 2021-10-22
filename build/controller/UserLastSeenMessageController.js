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
exports.UserLastSeenMessageController = void 0;
const constants_1 = require("../common/constants");
const functions_1 = require("../common/functions");
const UserLastSeenMessageDao_1 = require("../Dao/UserLastSeenMessageDao");
const Conversation_1 = require("../validations/Conversation");
const actions_1 = require("../socket/ConversationSocket/actions");
class UserLastSeenMessageController {
    constructor() {
        this.userLastSeenMessageDao = new UserLastSeenMessageDao_1.UserLastSeenMessageDao();
        this.updateLastSeen = this.updateLastSeen.bind(this);
    }
    updateLastSeen(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userInfo = res.locals.decodeToken;
            const { id_room, id_message } = req.body;
            const ConversationSocket = req.app.get(constants_1.SOCKET_LIST)[constants_1.SOCKET_NAMESPACE.CONVERSATION];
            if (ConversationSocket) {
                res.status(constants_1.BAD_REQUEST).json({ message: "Bad request" });
                return;
            }
            try {
                const isValid = yield Conversation_1.UpdateConversationLastSeenMessageSchema.validate({
                    id_room,
                    id_message
                }, { abortEarly: false });
            }
            catch (error) {
                (0, functions_1.throwValidateError)(error, next);
            }
            try {
                const result = yield this.userLastSeenMessageDao.updateUserLastSeenTime(id_room, userInfo.toString(), id_message);
                actions_1.RoomSocketActions.emitSeenMessageEvent(ConversationSocket, id_room, userInfo, id_message);
                res.json({ message: "Success" });
            }
            catch (error) {
                (0, functions_1.throwHttpError)(constants_1.DB_ERROR, constants_1.BAD_REQUEST, next);
            }
        });
    }
}
exports.UserLastSeenMessageController = UserLastSeenMessageController;
