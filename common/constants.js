"use strict";
exports.__esModule = true;
exports.GENDER = exports.CACHE_PREFIX = exports.MESSAGE_STATUS = exports.MESSAGE_TYPE = exports.FORBIDDEN = exports.SOCKET_LIST = exports.NOTIFICATION_TYPE = exports.USER_IN_ROOM_STATUS = exports.NOTIFICATION_STATUS = exports.CONVERSATION_TYPE = exports.FRIEND_STATUS = exports.SOCKET_PREFIX = exports.SOCKET_NAMESPACE = exports.SOCKET_ON_ACTIONS = exports.SOCKET_EMIT_ACTIONS = exports.HOST_NAME = exports.DB_ERROR = exports.REQUEST_SUCCESS = exports.UNAUTHORIZED = exports.INTERNAL_SERVER = exports.BAD_REQUEST = exports.VALIDATION_STATUS = exports.VALIDATION_ERROR = exports.VALIDATION_PHONE_REGEX = exports.DEL_FLAG = exports.imageFolder = exports.iconFolder = exports.serverAddress = void 0;
var serverAddress = "171.241.113.240";
exports.serverAddress = serverAddress;
var iconFolder = "/icon/";
exports.iconFolder = iconFolder;
var imageFolder = "/images/";
exports.imageFolder = imageFolder;
var DB_ERROR = "DB error";
exports.DB_ERROR = DB_ERROR;
var HOST_NAME = "socketservercn11.ddns.net";
exports.HOST_NAME = HOST_NAME;
var DEL_FLAG;
(function (DEL_FLAG) {
    DEL_FLAG[DEL_FLAG["VALID"] = 0] = "VALID";
    DEL_FLAG[DEL_FLAG["INVALID"] = 1] = "INVALID";
})(DEL_FLAG || (DEL_FLAG = {}));
exports.DEL_FLAG = DEL_FLAG;
var VALIDATION_ERROR = "Validation error";
exports.VALIDATION_ERROR = VALIDATION_ERROR;
var VALIDATION_STATUS = 500;
exports.VALIDATION_STATUS = VALIDATION_STATUS;
var VALIDATION_PHONE_REGEX = /^[0-9\-+]{10,11}$/;
exports.VALIDATION_PHONE_REGEX = VALIDATION_PHONE_REGEX;
var BAD_REQUEST = 400;
exports.BAD_REQUEST = BAD_REQUEST;
var INTERNAL_SERVER = 400;
exports.INTERNAL_SERVER = INTERNAL_SERVER;
var UNAUTHORIZED = 401;
exports.UNAUTHORIZED = UNAUTHORIZED;
var FORBIDDEN = 403;
exports.FORBIDDEN = FORBIDDEN;
var REQUEST_SUCCESS = 200;
exports.REQUEST_SUCCESS = REQUEST_SUCCESS;
var SOCKET_LIST = "SOCKET_LIST";
exports.SOCKET_LIST = SOCKET_LIST;
var SOCKET_NAMESPACE;
(function (SOCKET_NAMESPACE) {
    SOCKET_NAMESPACE["CONVERSATION"] = "/CONVERSATION";
    SOCKET_NAMESPACE["MESSAGE"] = "/MESSAGE";
    SOCKET_NAMESPACE["USER"] = "/USER";
    SOCKET_NAMESPACE["NOTIFICATION"] = "/NOTIFICATION";
})(SOCKET_NAMESPACE || (SOCKET_NAMESPACE = {}));
exports.SOCKET_NAMESPACE = SOCKET_NAMESPACE;
var SOCKET_PREFIX;
(function (SOCKET_PREFIX) {
    SOCKET_PREFIX["CONVERSATION"] = "CONVERSATION_";
    SOCKET_PREFIX["NOTIFICATION"] = "NOTIFICATION_";
    SOCKET_PREFIX["USER"] = "USER_";
})(SOCKET_PREFIX || (SOCKET_PREFIX = {}));
exports.SOCKET_PREFIX = SOCKET_PREFIX;
var FRIEND_STATUS;
(function (FRIEND_STATUS) {
    FRIEND_STATUS[FRIEND_STATUS["BLOCK"] = -1] = "BLOCK";
    FRIEND_STATUS[FRIEND_STATUS["STRANGE"] = 0] = "STRANGE";
    FRIEND_STATUS[FRIEND_STATUS["FRIEND"] = 1] = "FRIEND";
})(FRIEND_STATUS || (FRIEND_STATUS = {}));
exports.FRIEND_STATUS = FRIEND_STATUS;
var CONVERSATION_TYPE;
(function (CONVERSATION_TYPE) {
    CONVERSATION_TYPE[CONVERSATION_TYPE["SINGLE"] = 0] = "SINGLE";
    CONVERSATION_TYPE[CONVERSATION_TYPE["GROUP"] = 1] = "GROUP";
})(CONVERSATION_TYPE || (CONVERSATION_TYPE = {}));
exports.CONVERSATION_TYPE = CONVERSATION_TYPE;
var USER_IN_ROOM_STATUS;
(function (USER_IN_ROOM_STATUS) {
    USER_IN_ROOM_STATUS[USER_IN_ROOM_STATUS["NORMAL"] = 1] = "NORMAL";
    USER_IN_ROOM_STATUS[USER_IN_ROOM_STATUS["BLOCKED"] = 0] = "BLOCKED";
    USER_IN_ROOM_STATUS[USER_IN_ROOM_STATUS["DELETED"] = -1] = "DELETED";
})(USER_IN_ROOM_STATUS || (USER_IN_ROOM_STATUS = {}));
exports.USER_IN_ROOM_STATUS = USER_IN_ROOM_STATUS;
var NOTIFICATION_TYPE = {
    FRIEND_REQUEST: 1,
    NEW_MESSAGE: 0
};
exports.NOTIFICATION_TYPE = NOTIFICATION_TYPE;
var NOTIFICATION_STATUS;
(function (NOTIFICATION_STATUS) {
    NOTIFICATION_STATUS[NOTIFICATION_STATUS["REJECT"] = 1] = "REJECT";
    NOTIFICATION_STATUS[NOTIFICATION_STATUS["PENDING"] = 0] = "PENDING";
    NOTIFICATION_STATUS[NOTIFICATION_STATUS["FULFILLED"] = 1] = "FULFILLED";
})(NOTIFICATION_STATUS || (NOTIFICATION_STATUS = {}));
exports.NOTIFICATION_STATUS = NOTIFICATION_STATUS;
var MESSAGE_TYPE;
(function (MESSAGE_TYPE) {
    MESSAGE_TYPE[MESSAGE_TYPE["TEXT"] = 0] = "TEXT";
    MESSAGE_TYPE[MESSAGE_TYPE["IMAGE"] = 1] = "IMAGE";
    MESSAGE_TYPE[MESSAGE_TYPE["ICON"] = 2] = "ICON";
    MESSAGE_TYPE[MESSAGE_TYPE["VIDEO"] = 3] = "VIDEO";
    MESSAGE_TYPE[MESSAGE_TYPE["TEXT_AND_IMAGE"] = 4] = "TEXT_AND_IMAGE";
})(MESSAGE_TYPE || (MESSAGE_TYPE = {}));
exports.MESSAGE_TYPE = MESSAGE_TYPE;
var MESSAGE_STATUS;
(function (MESSAGE_STATUS) {
    MESSAGE_STATUS[MESSAGE_STATUS["NORMAL"] = 0] = "NORMAL";
    MESSAGE_STATUS[MESSAGE_STATUS["DELETED"] = -1] = "DELETED";
})(MESSAGE_STATUS || (MESSAGE_STATUS = {}));
exports.MESSAGE_STATUS = MESSAGE_STATUS;
var CACHE_PREFIX = {
    MESSAGE: "MESSAGE_"
};
exports.CACHE_PREFIX = CACHE_PREFIX;
var GENDER = {
    MALE: 0,
    FEMALE: 1
};
exports.GENDER = GENDER;
var SOCKET_EMIT_ACTIONS = {
    AUTHEN_SUCCESS: "AUTHEN_SUCCESS",
    AUTHEN_FAIL: "AUTHEN_FAIL",
    USER_QUIT_APPLICATION: "USER_QUIT_APPLICATION",
    USER_JOIN_APPLICATION: "USER_JOIN_APPLICATION",
    LIST_FRIEND: "LIST_FRIEND",
    EMIT_MESSAGE: "EMIT_MESSAGE",
    EMIT_NOTIFICATION: "EMIT_NOTIFICATION",
    SOCKET_READY: "SOCKET_READY",
    EMIT_IS_TYPING: "EMIT_IS_TYPING",
    EMIT_STOP_TYPING: "EMIT_STOP_TYPING",
    JOIN_NEW_ROOM: "JOIN_NEW_ROOM"
};
exports.SOCKET_EMIT_ACTIONS = SOCKET_EMIT_ACTIONS;
var SOCKET_ON_ACTIONS = {
    ON_DISCONNECT: "ON_DISCONNECT",
    ON_MESSAGE: "ON_MESSAGE",
    ON_STOP_TYPING: "ON_STOP_TYPING",
    ON_TYPING: "ON_TYPING",
    ON_AUTHENTICATE: "ON_AUTHENTICATE"
};
exports.SOCKET_ON_ACTIONS = SOCKET_ON_ACTIONS;
