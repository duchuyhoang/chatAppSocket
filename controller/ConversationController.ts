import { ConversationDao } from "../Dao/ConversationDao";
import { UserInConversationDao } from "../Dao/UserInConversationDao";
import { OkPacket } from "mysql";
import { NextFunction, Request, Response } from "express";
import {
  forBulkInsert,
  throwHttpError,
  throwNormalError,
  throwValidateError,
} from "../common/functions";
import {
  ConversationCreateGroupChatSchema,
  ConversationCreatePrivateChatSchema,
  ConversationCheckPrivateChatExistSchema,
} from "../validations/Conversation";
import { BAD_REQUEST, DB_ERROR } from "../common/constants";
import { DecodedUser } from "../models/User";
export class ConversationController {
  private conversationDao: ConversationDao;
  private userInConversationDao: UserInConversationDao;
  constructor() {
    this.conversationDao = new ConversationDao();
    this.userInConversationDao = new UserInConversationDao();
    this.createGroupConversation = this.createGroupConversation.bind(this);
    this.createPrivateConversation = this.createPrivateConversation.bind(this);
    this.checkPrivateConversationBetween =
      this.checkPrivateConversationBetween.bind(this);
  }

  public async checkPrivateConversationBetween(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id_friend } = req.body;
    const user_info: DecodedUser = res.locals.decodeToken;
    try {
      await ConversationCheckPrivateChatExistSchema.validate({
        id_friend,
      });
    } catch (error: any) {
      throwValidateError(error, next);
      return;
    }

    try {
      const result =
        await this.userInConversationDao.checkPrivateConversationExist(
          user_info.id_user.toString(),
          id_friend
        );
      if (result) {
        res.json({ idRoom: result.id_room });
      } else res.json({ idRoom: null });
    } catch (error) {
      console.log(error);
      throwHttpError(DB_ERROR, BAD_REQUEST, next);
    }
  }

  public async createGroupConversation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { title, list_user } = req.body;
    try {
      const isValid = await ConversationCreateGroupChatSchema.validate(
        { title, list_user },
        {
          abortEarly: false,
        }
      );
    } catch (error: any) {
      throwValidateError(error, next);
      return;
    }

    try {
      const userInfo = res.locals.decode.id_user;
      const { insertId: newIdRoom }: OkPacket =
        await this.conversationDao.addNewGroupConversation(
          title,
          userInfo.id_user
        );
      const parseListUser = JSON.parse(list_user);

      parseListUser.indexOf(parseInt(userInfo.id_user)) === -1 &&
        parseListUser.push(parseInt(userInfo.id_user));

      const data = forBulkInsert<{ id_user: string }>(
        parseListUser.map((id_user: string) => {
          return {
            id_user: id_user,
          };
        }),
        newIdRoom.toString()
      );

      await this.userInConversationDao.addUsersToConversation(data);
      res.json({ newIdRoom: newIdRoom });
    } catch (error) {
      throwHttpError(DB_ERROR, BAD_REQUEST, next);
      return;
    }
  }

  public async createPrivateConversation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id_friend } = req.body;
    const userInfo: DecodedUser = res.locals.decodeToken;
    // prevent same user
    if (userInfo.id_user.toString() === id_friend) {
      throwNormalError("Need different user", next);
      return;
    }

    try {
      const isValid = ConversationCreatePrivateChatSchema.validate(
        {
          id_friend,
        },
        {
          abortEarly: false,
        }
      );
    } catch (error: any) {
      throwValidateError(error, next);
      return;
    }

    // Check if a conversation between two user exist
    try {
      const conversation =
        await this.userInConversationDao.checkPrivateConversationExist(
          userInfo.id_user.toString(),
          id_friend
        );
      if (conversation) {
        throw new Error("Exist");
      }
    } catch (error) {
      throwNormalError("Conversation exist", next);
    }

    try {
      const { insertId: newIdRoom }: OkPacket =
        await this.conversationDao.addNewPrivateConversation(
          userInfo.id_user.toString()
        );
      const data = forBulkInsert<{ id_user: string }>(
        new Array(id_friend, userInfo.id_user).map((id_user: string) => {
          return {
            id_user: id_user,
          };
        }),
        newIdRoom.toString()
      );
      await this.userInConversationDao.addUsersToConversation(data);
      res.json({ newIdRoom: newIdRoom });
    } catch (error) {
      throwHttpError(DB_ERROR, BAD_REQUEST, next);
    }
  }
}
