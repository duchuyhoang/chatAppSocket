import { AuthenticationDao } from "../Dao/AuthenticationDao";
import { User } from "../models/User";
import { Request, Response, NextFunction } from "express";

export class AuthenticationController {
  private authenticationDao: AuthenticationDao;
  constructor() {
    this.authenticationDao = new AuthenticationDao();
    this.login = this.login.bind(this);
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;




    
    try {
      const user: User | null = await this.authenticationDao.login(
        email,
        password
      );
    } catch (error) {}
  }
}
