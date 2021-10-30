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
import {
  BAD_REQUEST,
  DB_ERROR,
  SOCKET_LIST,
  SOCKET_NAMESPACE,
} from "../common/constants";
import { DecodedUser } from "../models/User";
import { ConversationWithCreatorInfo } from "../TS/Conversation";
import { RoomSocketActions } from "../socket/ConversationSocket/actions";
import { Namespace } from "socket.io";
import { UserLastSeenMessageDao } from "../Dao/UserLastSeenMessageDao";
import { Maybe } from "yup/lib/types";

export class ConversationController {
  private conversationDao: ConversationDao;
  private userInConversationDao: UserInConversationDao;
  private userLastSeenMessageDao: UserLastSeenMessageDao;
  constructor() {
    this.conversationDao = new ConversationDao();
    this.userInConversationDao = new UserInConversationDao();
    this.userLastSeenMessageDao = new UserLastSeenMessageDao();
    this.createGroupConversation = this.createGroupConversation.bind(this);
    this.createPrivateConversation = this.createPrivateConversation.bind(this);
    this.checkPrivateConversationBetween =
      this.checkPrivateConversationBetween.bind(this);
    this.getConversations = this.getConversations.bind(this);
    this.getConversationById = this.getConversationById.bind(this);
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
      throwHttpError(DB_ERROR, BAD_REQUEST, next);
    }
  }

  public async createGroupConversation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    // list_user need to be an json array
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
      const userInfo = res.locals.decodeToken;
      const { insertId: newIdRoom }: OkPacket =
        await this.conversationDao.addNewGroupConversation(
          title,
          userInfo.id_user
        );
      const parseListUser: string[] = JSON.parse(list_user);

      parseListUser.indexOf(userInfo.id_user) === -1 &&
        parseListUser.push(userInfo.id_user);

      const data = forBulkInsert<{ id_user: string }>(
        parseListUser.map((id_user: string) => {
          return {
            id_user: id_user,
          };
        }),
        newIdRoom.toString()
      );

      await this.userInConversationDao.addUsersToConversation(data);

      const newConversation: ConversationWithCreatorInfo | null =
        await this.conversationDao.getConversationById(newIdRoom.toString());

      if (newConversation) {
        this.emitJoinRoom(req, parseListUser, newConversation);

        // this.userLastSeenMessageDao.
        const listUserToConversation = [
          ...parseListUser.map((id) =>
            this.userLastSeenMessageDao.addUserToRoom(newIdRoom.toString(), id)
          ),
        ];
        await Promise.all([listUserToConversation]);
      }

      res.json({ newRoom: newConversation });
    } catch (error) {
      throwHttpError(DB_ERROR, BAD_REQUEST, next);
      return;
    }
  }

  private emitJoinRoom(
    req: Request,
    listUser: string[],
    newConversation: ConversationWithCreatorInfo
  ) {
    const conversationSocket: Namespace =
      req.app.get(SOCKET_LIST)[SOCKET_NAMESPACE.CONVERSATION];

    if (conversationSocket) {
      RoomSocketActions.handleRoomGroup(
        conversationSocket,
        listUser,
        newConversation
      );
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

      try {
        const { insertId: newIdRoom }: OkPacket =
          await this.conversationDao.addNewPrivateConversation(
            userInfo.id_user.toString()
          );

        const data = forBulkInsert<{ id_user: string }>(
          [{ id_user: id_friend }, { id_user: userInfo.id_user.toString() }],
          newIdRoom.toString()
        );

        await this.userInConversationDao.addUsersToConversation(data);

        const newConversation: ConversationWithCreatorInfo | null =
          await this.conversationDao.getConversationById(newIdRoom.toString());

        if (newConversation) {
          const conversationSocket: Namespace =
            req.app.get(SOCKET_LIST)[SOCKET_NAMESPACE.CONVERSATION];

          if (conversationSocket) {
            RoomSocketActions.joinPrivateRoom(
              conversationSocket,
              [userInfo.id_user.toString(), id_friend],
              newConversation
            );
          }

          const listUserToConversation = [
            ...[userInfo.id_user.toString(), id_friend].map((id) =>
              this.userLastSeenMessageDao.addUserToRoom(
                newIdRoom.toString(),
                id
              )
            ),
          ];
          await Promise.all([listUserToConversation]);
        }
        res.json({ newRoom: newConversation });
      } catch (error) {}
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

  public async getConversationById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id_conversation = null } = req.params;

    if (!id_conversation) {
      throwNormalError("Conversation required", next);
      return;
    }

    try {
      const conversationInfo: Maybe<ConversationWithCreatorInfo> =
        await this.conversationDao.getConversationById(
          id_conversation.toString()
        );
      if (!conversationInfo) {
        res.json({
          conversationInfo,
          listUser: null,
        });
      } else {
        const listUserInRoom =
          await this.userInConversationDao.getAllConversationUser(
            id_conversation.toString()
          );
        const listUserLastSeenMessage =
          await this.userLastSeenMessageDao.getUserLastSeenInRoom(
            id_conversation.toString()
          );

        res.json({
          conversationInfo,
          listUser: listUserInRoom,
          lastSeenMessageData: listUserLastSeenMessage,
        });
      }
    } catch (error) {
      console.log(error);

      throwHttpError(DB_ERROR, BAD_REQUEST, next);
    }
  }

  public async getConversations(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const userInfo: DecodedUser = res.locals.decodeToken;

    try {
      const listConversations: ConversationWithCreatorInfo[] =
        await this.conversationDao.getConversationByUser(
          userInfo.id_user.toString()
        );
      res.json({ data: listConversations });
    } catch (error) {
      console.log(error);
      throwHttpError(DB_ERROR, BAD_REQUEST, next);
    }
  }


// public async getListSocketUserChat

}
