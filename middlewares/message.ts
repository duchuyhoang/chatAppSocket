import { NextFunction, Request, Response } from "express";
import { SendMessageSchema } from "../validations/Message";
import { UserInConversation } from "../models/UserInConversation";
import { UserInConversationDao } from "../Dao/UserInConversationDao";
import { throwValidateError } from "../common/functions";
import { DecodedUser } from "../models/User";
import { UNAUTHORIZED } from "../common/constants";

export const validateMessageInput = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { type, id_conversation, content } = req.body;
  const userInfo: DecodedUser = res.locals.decodeToken;
  const userInConversationDao = new UserInConversationDao();
  try {
    const isValid = SendMessageSchema.validate({
      type,
      id_conversation,
      content,
    });
  } catch (error: any) {
    throwValidateError(error, next);
    return;
  }

  //   Check user belong to this conversation
  const userInConversation = await userInConversationDao.getConversationByUser(
    userInfo.id_user?.toString() || "",
    id_conversation || ""
  );

  if (userInConversation.length === 0) {
    res.status(UNAUTHORIZED).json({ message: "Unauthorized" });
    return;
  }
  next();
  // const listUser=await userInConversationDao.
};

