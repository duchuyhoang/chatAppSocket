import { NextFunction, Request, Response } from "express";
import { OkPacket } from "mysql";
import {
  BAD_REQUEST,
  DB_ERROR,
  SOCKET_LIST,
  SOCKET_NAMESPACE,
} from "../common/constants";
import { throwHttpError, throwValidateError } from "../common/functions";
import { UserLastSeenMessageDao } from "../Dao/UserLastSeenMessageDao";
import { DecodedUser } from "../models/User";
import { UpdateConversationLastSeenMessageSchema } from "../validations/Conversation";
import { RoomSocketActions } from "../socket/ConversationSocket/actions";
import { Namespace } from "socket.io";
export class UserLastSeenMessageController {
  private userLastSeenMessageDao: UserLastSeenMessageDao;
  constructor() {
    this.userLastSeenMessageDao = new UserLastSeenMessageDao();
    this.updateLastSeen = this.updateLastSeen.bind(this);
  }

  public async updateLastSeen(req: Request, res: Response, next: NextFunction) {
    const userInfo: DecodedUser = res.locals.decodeToken;
    const { id_room,id_message } = req.body;

    const ConversationSocket: Namespace =
      req.app.get(SOCKET_LIST)[SOCKET_NAMESPACE.CONVERSATION];

    if (ConversationSocket) {
      res.status(BAD_REQUEST).json({ message: "Bad request" });
      return;
    }

    try {
      const isValid = await UpdateConversationLastSeenMessageSchema.validate(
        {
          id_room,
          id_message
        },
        { abortEarly: false }
      );
    } catch (error: any) {
      throwValidateError(error, next);
    }

    try {
      const result: OkPacket =
        await this.userLastSeenMessageDao.updateUserLastSeenTime(
          id_room,
          userInfo.toString(),
          id_message
        );

        RoomSocketActions.emitSeenMessageEvent(ConversationSocket,id_room, userInfo,id_message);

      res.json({ message: "Success" });
    } catch (error) {
      throwHttpError(DB_ERROR, BAD_REQUEST, next);
    }
  }
}
