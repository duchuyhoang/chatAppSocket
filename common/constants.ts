const serverAddress = "171.241.113.240";
const iconFolder = "/icon/";
const imageFolder = "/images/";
const DB_ERROR="DB error";
const HOST_NAME="socketservercn11.ddns.net"

enum DEL_FLAG {
  VALID = 0,
  INVALID = 1,
}

const VALIDATION_ERROR = "Validation error";
const VALIDATION_STATUS = 500;

const BAD_REQUEST = 400;
const INTERNAL_SERVER = 400;
const UNAUTHORIZED = 401;
const REQUEST_SUCCESS=200;
export {
  serverAddress,
  iconFolder,
  imageFolder,
  DEL_FLAG,
  VALIDATION_ERROR,
  VALIDATION_STATUS,
  BAD_REQUEST,
  INTERNAL_SERVER,
  UNAUTHORIZED,
  REQUEST_SUCCESS,
  DB_ERROR,
  HOST_NAME
};
