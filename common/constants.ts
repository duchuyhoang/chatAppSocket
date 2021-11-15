const serverAddress = "171.241.113.240";
const iconFolder = "/icon/";
const imageFolder = "/images/";
const DB_ERROR = "DB error";
const HOST_NAME = "socketservercn11.ddns.net";

enum DEL_FLAG {
  VALID = 0,
  INVALID = 1,
}

const queryInfoStringWithUser =
  "user.id_user,user.email,user.phone,user.name,user.delFlag,user.avatar,user.createAt,user.sex,user.lastSeen";

const VALIDATION_ERROR = "Validation error";
const VALIDATION_STATUS = 500;
const VALIDATION_PHONE_REGEX = /^[0-9\-+]{10,11}$/;

const BAD_REQUEST = 400;
const INTERNAL_SERVER = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;

const REQUEST_SUCCESS = 200;

const SOCKET_LIST = "SOCKET_LIST";

enum SOCKET_NAMESPACE {
  CONVERSATION = "/CONVERSATION",
  MESSAGE = "/MESSAGE",
  USER = "/USER",
  CALL_CHAT = "/CALL",
  NOTIFICATION = "/NOTIFICATION",
  
}
enum SOCKET_PREFIX {
  CONVERSATION = "CONVERSATION_",
  NOTIFICATION = "NOTIFICATION_",
  USER = "USER_",
  CALL_CHAT="CALL_"
}
enum FRIEND_STATUS {
  BLOCK = -1,
  STRANGE = 0,
  FRIEND = 1,
}

enum CONVERSATION_TYPE {
  SINGLE = 0,
  GROUP = 1,
}

enum USER_IN_ROOM_STATUS {
  NORMAL = 1,
  BLOCKED = 0,
  DELETED = -1,
}

const NOTIFICATION_TYPE = {
  FRIEND_REQUEST: 1,
  NEW_MESSAGE: 0,
  ACCEPT_FRIEND_REQUEST:2
} as const;

enum NOTIFICATION_STATUS {
  REJECT = -1,
  PENDING = 0,
  FULFILLED = 1,
}

enum MESSAGE_TYPE {
  TEXT = 0,
  IMAGE = 1,
  ICON = 2,
  VIDEO = 3,
  TEXT_AND_IMAGE = 4,
}
enum MESSAGE_STATUS {
  NORMAL = 0,
  DELETED = -1,
}

const CACHE_PREFIX = {
  MESSAGE: "MESSAGE_",
};

const GENDER = {
  MALE: 0,
  FEMALE: 1,
};

const SOCKET_EMIT_ACTIONS = {
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
  JOIN_NEW_ROOM: "JOIN_NEW_ROOM",
  EMIT_SEEN_MESSAGE: "EMIT_SEEN_MESSAGE",
  EMIT_LIST_USER_RESPONSE:"EMIT_LIST_USER_RESPONSE",
  EMIT_SIGNAL_OFFER:"EMIT_SIGNAL_OFFER",
  EMIT_SIGNAL_ANSWER:"EMIT_SIGNAL_ANSWER",
  USERS_JOIN_ROOM:"USERS_JOIN_ROOM",
  EMIT_SOMEONE_CALL:"EMIT_SOMEONE_CALL"
};

const SOCKET_ON_ACTIONS = {
  ON_DISCONNECT: "ON_DISCONNECT",
  ON_MESSAGE: "ON_MESSAGE",
  ON_STOP_TYPING: "ON_STOP_TYPING",
  ON_TYPING: "ON_TYPING",
  ON_AUTHENTICATE: "ON_AUTHENTICATE",
  ON_SENDING_SIGNAL:"ON_SENDING_SIGNAL",
  ON_GET_LIST_USER_IN_ROOM:"ON_GET_LIST_USER_IN_ROOM",
  ON_SEND_OFFER_SIGNAL:"ON_SEND_OFFER_SIGNAL",
  ON_SEND_ANSWER_SIGNAL:"ON_SEND_ANSWER_SIGNAL",
  ON_CALL_VIDEO_INFO:"ON_CALL_VIDEO_INFO"
};

export {
  serverAddress,
  iconFolder,
  imageFolder,
  DEL_FLAG,
  VALIDATION_PHONE_REGEX,
  VALIDATION_ERROR,
  VALIDATION_STATUS,
  BAD_REQUEST,
  INTERNAL_SERVER,
  UNAUTHORIZED,
  REQUEST_SUCCESS,
  DB_ERROR,
  HOST_NAME,
  SOCKET_EMIT_ACTIONS,
  SOCKET_ON_ACTIONS,
  SOCKET_NAMESPACE,
  SOCKET_PREFIX,
  FRIEND_STATUS,
  CONVERSATION_TYPE,
  NOTIFICATION_STATUS,
  USER_IN_ROOM_STATUS,
  NOTIFICATION_TYPE,
  SOCKET_LIST,
  FORBIDDEN,
  MESSAGE_TYPE,
  MESSAGE_STATUS,
  CACHE_PREFIX,
  GENDER,
  queryInfoStringWithUser
};
