import express, { Express, Request } from "express";
import { Server as SocketServer, Socket } from "socket.io";
import http, { Server, IncomingHttpHeaders } from "http";
import uploadRouter from "./router/uploadFileRouter";
import multer from "multer";
const bodyParser = require("body-parser");
import cors from "cors";
import path from "path";
import {unlinkSync} from "fs";
import { HttpError } from "./models/HttpError";
import { CustomValidationError } from "./models/CustomValidationError";
import logger from "./common/logger";
import { UNAUTHORIZED, INTERNAL_SERVER, BAD_REQUEST } from "./common/constants";
const app: Express = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "assets")));
app.use(cors());
app.use(bodyParser.json()); 
require("dotenv").config();
const server: Server = http.createServer(app);

const io = new SocketServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
// io.engine.on("headers", (headers:IncomingHttpHeaders, req:Request) => {
//     headers["test"] = "789";
//   });

// io.engine.on("initial_headers", (headers:IncomingHttpHeaders, req:Request) => {
//     headers["test"] = "123";
//     headers["set-cookie"] = ["mycookie=456"];
//   });

function LoginSocket(io: SocketServer, socket: Socket) {
  socket.on("Hello", async (data) => {
    await new Promise((resolve) => {
      setTimeout(() => {
        // console.log("ok", data);
        resolve(1000);
      }, 1000);
    });
  });
}

io.on("connection", (socket: Socket) => {
  LoginSocket(io, socket);
  socket.on("Hello2", async (data) => {});

  // socket.emit("Bat",{name:"huy"})
});
// io.of("/namespace").on("connection",(socket:Socket)=>{
// console.log(socket.id);
// socket.on("name1",(data)=>{
//     console.log(data);
//     console.log("namespace ok");

// })

// })

app.use("/upload", uploadRouter);
app.get("/cook", (req, res) => {
  res.cookie("cook", "hyy").json({ name: req.hostname });
});

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
        message: err.message||"Unexpected error",
      });
    }
  }
);


server.listen(3001, () => {
  console.log("Hello world");
});
