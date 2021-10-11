"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCount = void 0;
let count = 0;
function getCount() {
    count++;
    return count;
}
exports.getCount = getCount;
//     generateMessage({
//   id_message:dbResult.insertId.toString(),
//   type:MESSAGE_TYPE.TEXT,
//   content,
//   id_user:userInfo.id_user.toString(),
// userInfo,
// delFlag:DEL_FLAG.VALID,
// id_conversation,
// createAt:new Date().toISOString(),
// })
// this.emitMessage(
//   req,
//   listUser,
//   userInfo,
//   id_conversation,
//   {
//     idMessage: dbResult.insertId,
//     notificationType: NOTIFICATION_TYPE.NEW_MESSAGE,
//     messageType: MESSAGE_TYPE.TEXT,
//     creator: userInfo,
//     default: "New message",
//     data: content,
//   }
// );
