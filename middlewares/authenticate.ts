import { Request, Response, NextFunction } from "express";
import { FORBIDDEN, SOCKET_LIST, UNAUTHORIZED } from "../common/constants";
import jwt from "jsonwebtoken";
import { Socket } from "socket.io";
import { DecodedUser } from "../models/User";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const authHeader = req.headers["authorization"];
  const token = (authHeader && authHeader.split(" ")[1]) || null;
  if (token === null || token === "" || token === undefined)
    res.status(401).json({ message: "Unauthorized" });
  else {
    jwt.verify(token, process.env.TOKEN_SECRET as string, (err, decode) => {
      if (err) {
        res.status(UNAUTHORIZED).json({ message: "Unauthorized" });
      } else {
        // Return a old token info
        res.locals.decodeToken = decode;
        next();
      }
});
  }
};

export const checkSocketsEstablished = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.app.get(SOCKET_LIST)) {
    next();
  } else {
    res.status(FORBIDDEN).json({ message: "Socket established failed" });
  }
};

export const bindSocketData = (decodeData: DecodedUser) => {
  return (socket: Socket, next: any) => {
    if (decodeData) {
      socket.data.decode = decodeData;
      next();
    }
  };
};
