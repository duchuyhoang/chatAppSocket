import { NextFunction, Response, Request } from "express";
import { MessageDao } from "../Dao/MessageDao";
import { generateMessage, IQueryMessage, Message } from "../models/Message";
import {
  SendMessageSchema,
  GetMessageSchema,
  SendIconMessageSchema,
} from "../validations/Message";
import {
  throwHttpError,
  uploadMultipleImage,
  uploadSingle,
  forBulkInsert,
  formatDate,
  throwValidateError,
} from "../common/functions";
import { IconInfo } from "../TS/File";
import {
  NOTIFICATION_TYPE,
  SOCKET_LIST,
  SOCKET_NAMESPACE,
  SOCKET_PREFIX,
  UNAUTHORIZED,
  MESSAGE_TYPE,
  SOCKET_EMIT_ACTIONS,
  USER_IN_ROOM_STATUS,
  DB_ERROR,
  BAD_REQUEST,
  DEL_FLAG,
  CACHE_PREFIX,
} from "../common/constants";
import { UserInConversation } from "../models/UserInConversation";
import { UserInConversationDao } from "../Dao/UserInConversationDao";
import { DecodedUser } from "../models/User";
import { OkPacket } from "mysql";
import { Namespace } from "socket.io";
import { MessageCache } from "../cache/MessageCache";
import { NotificationSocketActions } from "../socket/NotificationSocket/actions";
import { RoomSocketActions } from "../socket/ConversationSocket/actions";
import { Pagination } from "../common/pagination";
import { FileDao } from "../Dao/FileDao";
export class MessageController {
  private messageDao: MessageDao;
  private fileDao: FileDao;
  private userInConversationDao: UserInConversationDao;

  constructor() {
    this.messageDao = new MessageDao();
    this.fileDao = new FileDao();
    this.userInConversationDao = new UserInConversationDao();
    this.emitMessage = this.emitMessage.bind(this);
    this.insertNewMessage = this.insertNewMessage.bind(this);
    this.getMesssages = this.getMesssages.bind(this);
    this.insertIconMessage = this.insertIconMessage.bind(this);
  }

  private emitMessage = (
    req: Request,
    listUser: UserInConversation[],
    userInfo: DecodedUser,
    id_conversation: string,
    notificationEmitData: any,
    messageEmitData: IQueryMessage | IQueryMessage[]
  ) => {
    const notificationSocket: Namespace =
      req.app.get(SOCKET_LIST)[SOCKET_NAMESPACE.NOTIFICATION];
    const conversationSocket: Namespace =
      req.app.get(SOCKET_LIST)[SOCKET_NAMESPACE.CONVERSATION];

    // Emit notification for each user in room
    listUser.forEach((user) => {
      if (
        user.status === USER_IN_ROOM_STATUS.NORMAL &&
        user.id_user.toString() !== userInfo.id_user.toString()
      ) {
        NotificationSocketActions.emitNotification(
          notificationSocket,
          SOCKET_PREFIX.NOTIFICATION + user.id_user,
          {
            type: NOTIFICATION_TYPE.NEW_MESSAGE,
            id_owner: userInfo.id_user,
            data: {
              ...notificationEmitData,
              // messageType: MESSAGE_TYPE.TEXT,
              // content,
            },
            createAt: new Date().toISOString(),
          }
        );
      }
    });
    // Message emit
    RoomSocketActions.emitMessageToConversation(
      conversationSocket,
      id_conversation,
      {
        id_owner: userInfo.id_user.toString(),
        messageType: MESSAGE_TYPE.TEXT,
        createAt: new Date().toISOString(),
        data: messageEmitData,
      }
    );
  };

  public async insertNewMessage(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { type, id_conversation = "" } = req.body;

    const userInfo: DecodedUser = res.locals.decodeToken;
    let listImageLink = null;
    let imageLink = null;

    const listUser: UserInConversation[] =
      await this.userInConversationDao.getAllConversationUser(
        // userInfo.id_user.toString(),
        (id_conversation as string) || ""
      );

    switch (type.toString()) {
      case MESSAGE_TYPE.TEXT.toString():
        await this.insertTextMessage(req, res, next, listUser);
        break;

      case MESSAGE_TYPE.IMAGE.toString():
        await this.insertImageMessage(req, res, next, listUser);
        break;

      case MESSAGE_TYPE.ICON.toString():
        await this.insertIconMessage(req,res,next,listUser);
        break;
      case MESSAGE_TYPE.TEXT_AND_IMAGE.toString():
        await this.insertTextAndMessage(req, res, next, listUser);
        break;

      default:
        res.status(BAD_REQUEST).json({ message: "Something wrong!" });
    }

    // try {
    //   const listImage: IconInfo[] = res.locals.imageInfo;
    //   if (listImage) {
    //     if (listImage.length === 1) {
    //       imageLink = await uploadSingle({
    //         file: res.locals.imageInfo[0].originalFile,
    //         newName: res.locals.imageInfo[0].newName,
    //       });
    //     } else {
    //       listImageLink = await uploadMultipleImage(
    //         listImage.map((image: IconInfo) => ({
    //           file: image.originalFile,
    //           newName: image.newName,
    //         }))
    //       );
    //     }

    //     // else
    //   }
    // } catch (err) {}
  }

  public async insertTextMessage(
    req: Request,
    res: Response,
    next: NextFunction,
    listUser: UserInConversation[]
  ) {
    const { content, id_conversation, id_preview } = req.body;
    const cachePrefix = CACHE_PREFIX.MESSAGE + id_conversation;
    const userInfo: DecodedUser = res.locals.decodeToken;
    try {
      const dbResult: OkPacket = await this.messageDao.insertNewTextMessage({
        content,
        id_conversation,
        id_user: userInfo.id_user.toString(),
      });

      const message: IQueryMessage = generateMessage({
        id_message: dbResult.insertId.toString(),
        type: MESSAGE_TYPE.TEXT,
        content: content,
        id_user: userInfo.id_user.toString(),
        userInfo,
        delFlag: DEL_FLAG.VALID,
        id_conversation,
        createAt: new Date().toISOString(),
      });

      // Set cache
      MessageCache.set(CACHE_PREFIX.MESSAGE + id_conversation, [
        ...(MessageCache.get<IQueryMessage[]>(cachePrefix) || []),
        message,
      ]);

      this.emitMessage(
        req,
        listUser,
        userInfo,
        id_conversation,
        {
          idMessage: dbResult.insertId,
          notificationType: NOTIFICATION_TYPE.NEW_MESSAGE,
          messageType: MESSAGE_TYPE.TEXT,
          creator: userInfo,
          default: "New message",
          data: content,
          id_preview,
        },
        message
      );

      res.json({
        data: {
          ...message,
          id_preview,
        },
      });
    } catch (err) {
      console.log(err);
      throwHttpError(DB_ERROR, BAD_REQUEST, next);
    }
  }

  public async insertImageMessage(
    req: Request,
    res: Response,
    next: NextFunction,
    listUser: UserInConversation[]
  ) {
    let listImageLink: string[] | null = null;
    let imageLink = null;
    let data: IQueryMessage[] = [];
    const { type, id_conversation = "", id_preview } = req.body;
    const cachePrefix = CACHE_PREFIX.MESSAGE + id_conversation;
    const userInfo: DecodedUser = res.locals.decodeToken;
    try {
      const listImage: IconInfo[] = res.locals.imageInfo;
      if (listImage) {
        if (listImage.length === 1) {
          imageLink = await uploadSingle({
            file: res.locals.imageInfo[0].originalFile,
            newName: res.locals.imageInfo[0].newName,
          });

          const dbResult: OkPacket =
            await this.messageDao.insertNewImageMessage({
              url: imageLink,
              id_user: userInfo.id_user.toString(),
              id_conversation,
            });
          data.push(
            generateMessage({
              id_message: dbResult.insertId.toString(),
              type: MESSAGE_TYPE.IMAGE,
              url: imageLink,
              id_user: userInfo.id_user.toString(),
              userInfo,
              delFlag: DEL_FLAG.VALID,
              id_conversation,
              createAt: new Date().toISOString(),
            })
          );
        } else if (listImage.length > 1) {
          listImageLink = await uploadMultipleImage(
            listImage.map((image: IconInfo) => ({
              file: image.originalFile,
              newName: image.newName,
            }))
          );

          const insertData = forBulkInsert(
            listImageLink.map((link: string) => ({
              id_conversation,
              type: MESSAGE_TYPE.IMAGE,
              link,
              createAt: formatDate(new Date()),
            })),
            userInfo.id_user.toString()
          );

          const dbResult: OkPacket =
            await this.messageDao.insertMultipleImageMessage(insertData);

          for (let i = 0; i < dbResult.affectedRows; i++) {
            data.push(
              generateMessage({
                id_message: (
                  parseInt(dbResult.insertId.toString()) + i
                ).toString(),
                type: MESSAGE_TYPE.IMAGE,
                url: listImageLink[i],
                id_user: userInfo.id_user.toString(),
                userInfo,
                delFlag: DEL_FLAG.VALID,
                id_conversation,
                createAt: new Date().toISOString(),
              })
            );
          }
        }
        // set cache
        MessageCache.set(CACHE_PREFIX.MESSAGE + id_conversation, [
          ...(MessageCache.get<IQueryMessage[]>(cachePrefix) || []),
          ...data,
        ]);

        this.emitMessage(
          req,
          listUser,
          userInfo,
          id_conversation,
          {
            type: MESSAGE_TYPE.IMAGE,
            notificationType: NOTIFICATION_TYPE.NEW_MESSAGE,
            creator: userInfo,
            default: "New image",
            data,
          },
          data
        );
        // else
        res.json({ data, id_preview });
      }
    } catch (err) {
      throwHttpError(DB_ERROR, BAD_REQUEST, next);
    }
  }

  public async insertIconMessage(
    req: Request,
    res: Response,
    next: NextFunction,
    listUser: UserInConversation[]
  ) {
    const { id_icon, id_conversation, id_preview, type } = req.body;
    const userInfo: DecodedUser = res.locals.decodeToken;
    try {
      const isValid = await SendIconMessageSchema.validate({
        id_icon,
        id_conversation,
        type,
      });
    } catch (error: any) {
      throwValidateError(error, next);
      return;
    }

    try {
      const selectedIcon = await this.fileDao.getIconById(id_icon);
      if (!selectedIcon) {
        res.status(400).json({ message: "That icon is no longer exist" });
        return;
      }

      const dbResult: OkPacket = await this.messageDao.insertNewIconMessage({
        id_conversation,
        id_icon,
        id_user: userInfo.id_user.toString(),
      });

      const newMessage = generateMessage({
        id_message: dbResult.insertId.toString(),
        createAt: new Date().toISOString(),
        id_user: userInfo.id_user.toString(),
        delFlag: DEL_FLAG.VALID,
        id_conversation: id_conversation,
        type: MESSAGE_TYPE.ICON,
        userInfo,
        id_icon: selectedIcon.id_icon.toString(),
        iconUrl: selectedIcon.iconUrl,
        icon_delFlg: selectedIcon.delFlag,
        blocksOfWidth: selectedIcon.blocksOfWidth,
        blocksOfHeight: selectedIcon.blocksOfHeight,
        width: selectedIcon.width,
        height: selectedIcon.height,
        totalFrames: selectedIcon.totalFrames,
        icon_createAt: selectedIcon.createAt
          ? selectedIcon.createAt.toString()
          : new Date().toISOString(),
        icon_category: selectedIcon.category.id,
      });

      this.emitMessage(
        req,
        listUser,
        userInfo,
        id_conversation,
        {
          type: MESSAGE_TYPE.ICON,
          notificationType: NOTIFICATION_TYPE.NEW_MESSAGE,
          creator: userInfo,
          default: "Icon message",
          newMessage,
          id_preview,
        },
        newMessage
      );

      res.json({ data: newMessage, id_preview });
    } catch (err) {
      throwHttpError(DB_ERROR, BAD_REQUEST, next);
    }
  }

  public async insertTextAndMessage(
    req: Request,
    res: Response,
    next: NextFunction,
    listUser: UserInConversation[]
  ) {
    let listImageLink: string[] | null = null;
    let imageLink = null;
    let data: IQueryMessage[] = [];
    const { type, id_conversation = "", content, id_preview } = req.body;
    const cachePrefix = CACHE_PREFIX.MESSAGE + id_conversation;
    const userInfo: DecodedUser = res.locals.decodeToken;
    const listImage: IconInfo[] = res.locals.imageInfo;
    try {
      // Message handle
      const dbMessageResult: OkPacket =
        await this.messageDao.insertNewTextMessage({
          content,
          id_conversation,
          id_user: userInfo.id_user.toString(),
        });

      data.push(
        generateMessage({
          id_message: dbMessageResult.insertId.toString(),
          type: MESSAGE_TYPE.TEXT,
          content: content,
          id_user: userInfo.id_user.toString(),
          userInfo,
          delFlag: DEL_FLAG.VALID,
          id_conversation,
          createAt: new Date().toISOString(),
        })
      );

      // Image handle
      if (listImage) {
        if (listImage.length === 1) {
          imageLink = await uploadSingle({
            file: res.locals.imageInfo[0].originalFile,
            newName: res.locals.imageInfo[0].newName,
          });

          const dbResult: OkPacket =
            await this.messageDao.insertNewImageMessage({
              url: imageLink,
              id_user: userInfo.id_user.toString(),
              id_conversation,
            });
          data.push(
            generateMessage({
              id_message: dbResult.insertId.toString(),
              type: MESSAGE_TYPE.IMAGE,
              url: imageLink,
              createAt: new Date().toISOString(),
              userInfo,
              delFlag: DEL_FLAG.VALID,
              id_conversation,
              id_user: userInfo.id_user.toString(),
            })
          );
        } else if (listImage.length > 1) {
          listImageLink = await uploadMultipleImage(
            listImage.map((image: IconInfo) => ({
              file: image.originalFile,
              newName: image.newName,
            }))
          );

          const insertData = forBulkInsert(
            listImageLink.map((link: string) => ({
              id_conversation,
              type: MESSAGE_TYPE.IMAGE,
              link,
              createAt: formatDate(new Date()),
            })),
            userInfo.id_user.toString()
          );

          const dbResult: OkPacket =
            await this.messageDao.insertMultipleImageMessage(insertData);

          for (let i = 0; i < dbResult.affectedRows; i++) {
            data.push(
              generateMessage({
                id_message: (
                  parseInt(dbResult.insertId.toString()) + i
                ).toString(),
                type: MESSAGE_TYPE.IMAGE,
                url: listImageLink[i],
                createAt: new Date().toISOString(),
                userInfo,
                delFlag: DEL_FLAG.VALID,
                id_conversation,
                id_user: userInfo.id_user.toString(),
              })
            );
          }
        }
        // set cache
        MessageCache.set(CACHE_PREFIX.MESSAGE + id_conversation, [
          ...(MessageCache.get<IQueryMessage[]>(cachePrefix) || []),
          ...data,
        ]);

        this.emitMessage(
          req,
          listUser,
          userInfo,
          id_conversation,
          {
            type: MESSAGE_TYPE.TEXT_AND_IMAGE,
            notificationType: NOTIFICATION_TYPE.NEW_MESSAGE,
            creator: userInfo,
            default: "Text and image",
            data,
            id_preview,
          },
          data
        );
        // else
        res.json({ data, id_preview });
      }
    } catch (err) {
      throwHttpError(DB_ERROR, BAD_REQUEST, next);
    }
  }

  public async getMesssages(req: Request, res: Response, next: NextFunction) {
    const { offset, limit, id_conversation = "" } = req.query;

    try {
      const isValid = await GetMessageSchema.validate({
        offset,
        limit,
      });
    } catch (err: any) {
      throwValidateError(err, next);
      return;
    }

    const userInfo: DecodedUser = res.locals.decodeToken;
    let userExist = false;
    try {
      const listUser = await this.userInConversationDao.getAllConversationUser(
        id_conversation?.toString() || ""
      );

      for (let i = 0; i < listUser.length; i++) {
        if (listUser[i].id_user.toString() === userInfo.id_user.toString()) {
          userExist = true;
          break;
        }
      }

      if (!userExist) {
        res.status(UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }

      let listMessage: IQueryMessage[] = [];

      const memoMessages: IQueryMessage[] | undefined = MessageCache.get<
        IQueryMessage[]
      >(CACHE_PREFIX.MESSAGE + id_conversation);

      // if (!memoMessages) {
      //   listMessage = await this.messageDao.getMessageByConversation(
      //     id_conversation?.toString() || ""
      //   );
      //   MessageCache.set(CACHE_PREFIX.MESSAGE + id_conversation, listMessage);
      // } else {
      //   console.log("memo");
      //   listMessage = memoMessages;
      // }

      listMessage = await this.messageDao.getMessageByConversation(
        id_conversation?.toString() || ""
      );
  

      res.json({
        ...Pagination(
          listMessage,
          parseInt(offset?.toString() || "0"),
          parseInt(limit?.toString() || "1")
        ),
      });
    } catch (err) {
      throwHttpError(DB_ERROR, BAD_REQUEST, next);
    }
  }
}
