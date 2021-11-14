import { AuthenticationDao } from "../Dao/AuthenticationDao";
import { DecodedUser, User } from "../models/User";
import { Request, Response, NextFunction } from "express";
import { LoginSchema, SignupSchema } from "../validations/Authentication";
import {
  throwHttpError,
  throwValidateError,
  generateAccessToken,
  generateRefreshToken,
  throwNormalError,
  uploadSingle,
} from "../common/functions";
import { MysqlError } from "mysql";
import {
  BAD_REQUEST,
  DB_ERROR,
  SOCKET_LIST,
  UNAUTHORIZED,
} from "../common/constants";
import jwt from "jsonwebtoken";
export class AuthenticationController {
  private authenticationDao: AuthenticationDao;
  constructor() {
    this.authenticationDao = new AuthenticationDao();
    this.login = this.login.bind(this);
    this.signUp = this.signUp.bind(this);
    this.reLogin = this.reLogin.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    try {
      const isValid = await LoginSchema.validate(
        { email, password },
        {
          abortEarly: false,
        }
      );
    } catch (error: any) {
      throwValidateError(error, next);
      return;
    }

    try {
      const user: User | null = await this.authenticationDao.login(
        email,
        password
      );
      if (user === null)
        res.status(UNAUTHORIZED).json({ message: "Unauthorized" });
      else {
        const { password, ...userInfo } = user;
        res.json({
          accessToken: generateAccessToken({ ...userInfo }),
          refreshToken: generateRefreshToken({ ...userInfo }),
        });
      }
    } catch (error) {
      console.log(error);      
      throwHttpError(DB_ERROR, BAD_REQUEST, next);
    }
  }

  public async signUp(req: Request, res: Response, next: NextFunction) {
    const { email, password, phone, name, sex } = req.body;
    let avatar = null;
    try {
      const isValid = await SignupSchema.validate(
        {
          email,
          password,
          phone,
          name,
          avatar,
          sex,
        },
        {
          abortEarly: false,
        }
      );
    } catch (error: any) {
      throwValidateError(error, next);
      return;
    }

    try {
      const isUserExist = await this.authenticationDao.checkUserExist(email);
      if (!isUserExist) {
        try {
          if (res.locals.imageInfo) {
            const link = await uploadSingle({
              file: res.locals.imageInfo[0].originalFile,
              newName: res.locals.imageInfo[0].newName,
            });
            avatar = link;
          }
        } catch (error) {}

        const insertRecord = await this.authenticationDao.signup({
          email,
          password,
          phone,
          name,
          avatar,
          sex,
        });
        res.json({
          accessToken: generateAccessToken({
            id_user: insertRecord.insertId,
            email,
            phone,
            name,
            avatar,
          }),
          refreshToken: generateRefreshToken({
            id_user: insertRecord.insertId,
            email,
            phone,
            name,
            avatar,
          }),
        });
      } else throwNormalError("User exist", next);
    } catch (error) {
      throwHttpError(DB_ERROR, BAD_REQUEST, next);
    }
  }

  public async reLogin(req: Request, res: Response) {
    const oldTokenInfo = res.locals.decodeToken || null;
    if (oldTokenInfo) {
      const { exp, tokenExpireTime, iat, ...rest } = oldTokenInfo;
      const userInfo = await this.authenticationDao.reLogin(
        oldTokenInfo.id_user
      );

      if (userInfo) {
        const { password, ...rest } = userInfo;
        const accessToken = generateAccessToken({ ...rest });
        res.json({
          accessToken: accessToken,
        });
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
    } else res.status(401).json({ message: "Unauthorized" });
  }

  public async refreshToken(req: Request, res: Response) {
    const refreshToken = req.body.refresh_token || null;
    if (refreshToken) {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET || "",
        async (err: any, decode: any) => {
          if (err) {
            res.status(401).json({ err });
          } else {
            const { id_user } = decode as DecodedUser;
            const userInfo = await this.authenticationDao.reLogin(
              id_user.toString()
            );
            if (userInfo) {
              const { password, ...rest } = userInfo;
              const accessToken = generateAccessToken({
                ...rest,
              });
              res.status(200).json({ accessToken });
            } else res.status(401).json({ message: "Unauthorized" });
          }
        }
      );
    } else res.status(401).json({ message: "Unauthorized" });
  }
}
