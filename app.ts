import express, { Express, NextFunction, Request } from "express";
import { Server as SocketServer, Socket } from "socket.io";
import http, { Server, IncomingHttpHeaders } from "http";
import uploadRouter from "./router/uploadFileRouter";
import authenticationRouter from "./router/authenticate";
import conversationRouter from "./router/conversationRouter";
import userRouter from "./router/userRouter";
import messageRouter from "./router/messageRouter";
import multer from "multer";
const bodyParser = require("body-parser");
import cors from "cors";
import path from "path";
import { unlinkSync } from "fs";
import { HttpError } from "./models/HttpError";
import { CustomValidationError } from "./models/CustomValidationError";
import logger from "./common/logger";
import {getCount} from "./apb";
import {
  UNAUTHORIZED,
  INTERNAL_SERVER,
  BAD_REQUEST,
  SOCKET_EMIT_ACTIONS,
  SOCKET_NAMESPACE,
  SOCKET_LIST,
} from "./common/constants";

// import { socketVerifyToken } from "./middlewares/authenticate";
import { socketManager } from "./socket";
import jwt from "jsonwebtoken";
import { bindSocketData } from "./middlewares/authenticate";
const app: Express = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "assets")));
app.use(cors());
app.use(bodyParser.json());
app.set(SOCKET_LIST, null);
require("dotenv").config();
const server: Server = http.createServer(app);

const io = new SocketServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  // transports: ['websocket']

});
// io.engine.on("headers", (headers:IncomingHttpHeaders, req:Request) => {
//     headers["test"] = "789";
//   });

// io.engine.on("initial_headers", (headers:IncomingHttpHeaders, req:Request) => {
//     headers["test"] = "123";
//     headers["set-cookie"] = ["mycookie=456"];
//   });

// io.use(socketVerifyToken);


// io.of("/TEST").on("connection",(socket:Socket)=>{
//   console.log("d",getCount());
// })



io.sockets.on("connection", (socket:Socket) => {
  // const socketList = io._nsps.forEach((nsp) => {
  //   nsp.on("connect", function (socket) {
  //     jwt.verify(
  //       (socket.data.decode as string) || "",
  //       process.env.TOKEN_SECRET as string,
  //       (err: any, decode: any) => {
  //         if (err) {
  //           // nsp._remove(socket);
  //           // nsp.sockets.delete(socket.id);
  //         } else {
  //           // delete
  //         }
  //       }
  //     );
  //   });
  // });


  socket.once("authenticate", (data) => {  
    jwt.verify(
      data.token,
      process.env.TOKEN_SECRET as string,
      (err: any, decode: any) => {
        if (err) {
          console.log(err);
        } else {
          socket.data.decode = decode;
          io._nsps.forEach((nsp) => {
            nsp.sockets.forEach((_socket) => {           
              if (_socket.id === socket.id) nsp.sockets.set(socket.id, socket);
            });
          });
        }
      }
    );
  });

  // if socket didnt authenticate just disconnect it else call another socket with parse info
   setTimeout(() => {
    if (socket.data.decode) {  
      socket.emit(SOCKET_EMIT_ACTIONS.AUTHEN_SUCCESS);
      const socketList = socketManager(io, socket.data.decode);
      app.set(SOCKET_LIST, socketList);
    } else {
      app.set(SOCKET_LIST, null);
      socket.emit(SOCKET_EMIT_ACTIONS.AUTHEN_FAIL);
      socket.disconnect();
    }
  },1500)}
);

app.use("/upload", uploadRouter);
app.use("/authen", authenticationRouter);
app.use("/user", userRouter);
app.use("/conversation", conversationRouter);
app.use("/message",messageRouter)



app.get("/cook", (req, res) => {
  res.cookie("cook", "hyy").json({ name: req.hostname });
});

// Error handle
app.use(
  (
    err: Error | CustomValidationError | HttpError,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    logger.err(err, true);
    if (err instanceof HttpError) {
      res.status(err.status | BAD_REQUEST).json({
        message: err.message,
      });
    } else if (err instanceof CustomValidationError) {
      res.status(err.status | INTERNAL_SERVER).json({
        message: err.message,
        errors: err.fieldsError,
      });
    } else {
      res.status(BAD_REQUEST).json({
        message: err.message || "Unexpected error",
      });
    }
  }
);

server.listen(process.env.PORT || 3001, () => {
  console.log("Hello world");
});
