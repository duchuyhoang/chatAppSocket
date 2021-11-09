"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateConversationLastSeenMessageSchema = exports.ConversationCheckPrivateChatExistSchema = exports.ConversationCreatePrivateChatSchema = exports.ConversationAddUsersSchema = exports.ConversationCreateGroupChatSchema = void 0;
const yup = __importStar(require("yup"));
exports.ConversationCreateGroupChatSchema = yup.object().shape({
    title: yup.string().required("Need title"),
    // creator: yup.string().required("Creator required"),
    list_user: yup
        .array()
        .required("Need list user")
        .test("listUser", "List user wrong", (list_user) => {
        try {
            // const list = JSON.parse(list_user);
            return Array.isArray(list_user) && (list_user === null || list_user === void 0 ? void 0 : list_user.length) > 0;
        }
        catch (error) {
            return false;
        }
    }),
});
exports.ConversationAddUsersSchema = yup.object().shape({
    id_room: yup.string().required("Need a room"),
    list_user: yup
        .array()
        .required("Need list user")
        .test("listUser", "List user wrong", (list_user) => {
        try {
            // const list = JSON.parse(list_user);
            return Array.isArray(list_user) && (list_user === null || list_user === void 0 ? void 0 : list_user.length) > 0;
        }
        catch (error) {
            return false;
        }
    }),
});
exports.ConversationCreatePrivateChatSchema = yup.object().shape({
    id_friend: yup.string().required("Must include a friend"),
});
exports.ConversationCheckPrivateChatExistSchema = yup.object().shape({
    id_friend: yup.string().required("Must include a friend"),
});
exports.UpdateConversationLastSeenMessageSchema = yup.object().shape({
    id_room: yup.string().required("Must include a room"),
    id_message: yup.string().required("Must include a message"),
});
// expot const ConversationGetMessageSchema
