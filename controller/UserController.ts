import {
  BAD_REQUEST,
  DB_ERROR,
  SOCKET_LIST,
  SOCKET_NAMESPACE,
} from "../common/constants";
import { throwHttpError } from "../common/functions";
import { UserDao } from "../Dao/UserDao";
import { Request, Response, NextFunction } from "express";
import { Maybe } from "../TS/Common";
import { Namespace, Socket } from "socket.io";
import {socketList} from "../socket/index";;
export class UserController {
  private UserDao: UserDao;

  constructor() {
    this.UserDao = new UserDao();
    this.getUserFriend = this.getUserFriend.bind(this);
    this.searchUserByEmailOrPhone = this.searchUserByEmailOrPhone.bind(this);
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
      // console.log("nn1", namespace.adapter.rooms);

      // namespace.on("connection",(socket:Socket)=>{
      console.log("nn", namespace2.adapter.rooms);
      // console.log("soc",socket.data.decode);

      // });

      // namespace.on("connect",(socket.))
    } else {
      console.log("đa");
    }
    const { email = null, phone = null } = req.query;
    try {
      const result = await this.UserDao.searchUserByEmailOrPhone(
        email as Maybe<string>,
        phone as Maybe<string>
      );
      res.json({ result });
    } catch (err) {
      console.log(err);
      throwHttpError(DB_ERROR, BAD_REQUEST, next);
    }
  }
}
