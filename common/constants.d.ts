declare const serverAddress = "171.241.113.240";
declare const iconFolder = "/icon/";
declare const imageFolder = "/images/";
declare const DB_ERROR = "DB error";
declare const HOST_NAME = "socketservercn11.ddns.net";
declare enum DEL_FLAG {
    VALID = 0,
    INVALID = 1
}
declare const VALIDATION_ERROR = "Validation error";
declare const VALIDATION_STATUS = 500;
declare const VALIDATION_PHONE_REGEX: RegExp;
declare const BAD_REQUEST = 400;
declare const INTERNAL_SERVER = 400;
declare const UNAUTHORIZED = 401;
declare const FORBIDDEN = 403;
declare const REQUEST_SUCCESS = 200;
declare const SOCKET_LIST = "SOCKET_LIST";
declare enum SOCKET_NAMESPACE {
    CONVERSATION = "/CONVERSATION",
    MESSAGE = "/MESSAGE",
    USER = "/USER",
    NOTIFICATION = "/NOTIFICATION"
}
declare enum SOCKET_PREFIX {
    CONVERSATION = "CONVERSATION_",
    NOTIFICATION = "NOTIFICATION_",
    USER = "USER_"
}
declare enum FRIEND_STATUS {
    BLOCK = -1,
    STRANGE = 0,
    FRIEND = 1
}
declare enum CONVERSATION_TYPE {
    SINGLE = 0,
    GROUP = 1
}
declare enum USER_IN_ROOM_STATUS {
    NORMAL = 1,
    BLOCKED = 0,
    DELETED = -1
}
declare const NOTIFICATION_TYPE: {
    readonly FRIEND_REQUEST: 1;
    readonly NEW_MESSAGE: 0;
};
declare enum NOTIFICATION_STATUS {
    REJECT = 1,
    PENDING = 0,
    FULFILLED = 1
}
declare enum MESSAGE_TYPE {
    TEXT = 0,
    IMAGE = 1,
    ICON = 2,
    VIDEO = 3,
    TEXT_AND_IMAGE = 4
}
declare enum MESSAGE_STATUS {
    NORMAL = 0,
    DELETED = -1
}
declare const CACHE_PREFIX: {
    MESSAGE: string;
};
declare const GENDER: {
    MALE: number;
    FEMALE: number;
};
declare const SOCKET_EMIT_ACTIONS: {
    AUTHEN_SUCCESS: string;
    AUTHEN_FAIL: string;
    USER_QUIT_APPLICATION: string;
    USER_JOIN_APPLICATION: string;
    LIST_FRIEND: string;
    EMIT_MESSAGE: string;
    EMIT_NOTIFICATION: string;
    SOCKET_READY: string;
    EMIT_IS_TYPING: string;
    EMIT_STOP_TYPING: string;
    JOIN_NEW_ROOM: string;
};
declare const SOCKET_ON_ACTIONS: {
    ON_DISCONNECT: string;
    ON_MESSAGE: string;
    ON_STOP_TYPING: string;
    ON_TYPING: string;
    ON_AUTHENTICATE: string;
};
export { serverAddress, iconFolder, imageFolder, DEL_FLAG, VALIDATION_PHONE_REGEX, VALIDATION_ERROR, VALIDATION_STATUS, BAD_REQUEST, INTERNAL_SERVER, UNAUTHORIZED, REQUEST_SUCCESS, DB_ERROR, HOST_NAME, SOCKET_EMIT_ACTIONS, SOCKET_ON_ACTIONS, SOCKET_NAMESPACE, SOCKET_PREFIX, FRIEND_STATUS, CONVERSATION_TYPE, NOTIFICATION_STATUS, USER_IN_ROOM_STATUS, NOTIFICATION_TYPE, SOCKET_LIST, FORBIDDEN, MESSAGE_TYPE, MESSAGE_STATUS, CACHE_PREFIX, GENDER };
