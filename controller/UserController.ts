import {
  BAD_REQUEST,
  DB_ERROR,
  SOCKET_LIST,
  SOCKET_NAMESPACE,
} from "../common/constants";
import {
  throwHttpError,
  throwNormalError,
  throwValidateError,
  uploadSingle,
} from "../common/functions";
import { UserDao } from "../Dao/UserDao";
import { Request, Response, NextFunction } from "express";
import { Maybe } from "../TS/Common";
import { Namespace, Socket } from "socket.io";
import { socketList } from "../socket/index";
import { DecodedUser, IUpdateUser } from "../models/User";
import { OkPacket } from "mysql";
import { UpdateUserSchema } from "../validations/Authentication";
export class UserController {
  private UserDao: UserDao;

  constructor() {
    this.UserDao = new UserDao();
    this.getUserFriend = this.getUserFriend.bind(this);
    this.searchUserByEmailOrPhone = this.searchUserByEmailOrPhone.bind(this);
    this.viewRelationshipStatus = this.viewRelationshipStatus.bind(this);
    this.editUser = this.editUser.bind(this);
    this.getUserById=this.getUserById.bind(this);
  }

  public async getUserFriend(req: Request, res: Response, next: NextFunction) {
    const { id_user } = res.locals.decodeToken;
    try {
      const result = await this.UserDao.getListFriend(id_user);
      res.json({ listFriend: result });
    } catch (e) {
      throwHttpError(DB_ERROR, BAD_REQUEST, next);
    }
  }

  public async searchUserByEmailOrPhone(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (req.app.get(SOCKET_LIST)) {
      // const socketList = req.app.get(SOCKET_LIST);
      // const namespace: Namespace = req.app.get(SOCKET_LIST)["/USER"];
      const namespace2: Namespace = socketList["/CONVERSATION"];
    } else {
    }
    const { keyword = null } = req.query;
    const userInfo: DecodedUser = res.locals.decodeToken;

    try {
      const result = await this.UserDao.searchUserByEmailOrPhone(
        keyword?.toString() || "",
        userInfo.id_user.toString()
      );

      // result.map((user)=>{
      //   delete
      // })

      res.json({ result });
    } catch (err) {
      console.log(err);
      throwHttpError(DB_ERROR, BAD_REQUEST, next);
    }
  }

  public async viewRelationshipStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id_friend } = req.params;
    const userInfo: DecodedUser = res.locals.decodeToken;
    if (!id_friend) {
      res.status(BAD_REQUEST).json({ message: "Id friend required" });
      return;
    }

    try {
      const status = await this.UserDao.getFriendStatusBetween(
        userInfo.id_user.toString(),
        id_friend.toString() || ""
      );
      res.json({ status });
    } catch (err) {
      throwHttpError(DB_ERROR, BAD_REQUEST, next);
    }
  }

  public async getUserById(req: Request, res: Response, next: NextFunction) {
    const {id} = req.params;
    const userInfo: DecodedUser = res.locals.decodeToken;
    try {
      const result = await this.UserDao.getUserInfoById(userInfo.id_user.toString(),id?.toString()||"");   
      res.json({ data: result });
    } catch (err) {
      console.log(err);
      
      throwHttpError(DB_ERROR, BAD_REQUEST, next);
    }
  }

  public async editUser(req: Request, res: Response, next: NextFunction) {
    const { password = null, phone = null, name = null, sex = null } = req.body;
    let avatar = null;
    const userInfo: DecodedUser = res.locals.decodeToken;

    try {
      const isValid = await UpdateUserSchema.validate({
        password,
        phone,
        name,
        sex,
      });
    } catch (err: any) {
      throwValidateError(err, next);
      return;
    }

    try {
      if (res.locals.imageInfo) {
        avatar = await uploadSingle({
          file: res.locals.imageInfo[0].originalFile,
          newName: res.locals.imageInfo[0].newName,
        });
      }
    } catch (error) {}

    let updatePayload: Partial<IUpdateUser> & { [key: string]: any } = {
      password,
      phone,
      name,
      sex,
      avatar,
    };

    Object.keys(updatePayload).map((key: string) => {
      if (!updatePayload[key]) delete updatePayload[key];
    });

    if (Object.keys(updatePayload).length === 0) {
      throwNormalError("Need at least 1 field", next);
      return;
    }

    try {
      let result: OkPacket = await this.UserDao.updateUser({
        ...updatePayload,
        id_user: userInfo.id_user.toString(),
      });
      const newUser=await this.UserDao.getCurrentUser(userInfo.id_user.toString());
      res.json({ data: newUser });
    } catch (error) {
      throwHttpError(DB_ERROR, BAD_REQUEST, next);
    }
  }
}
