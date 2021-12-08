"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const uploadFileRouter_1 = __importDefault(require("./router/uploadFileRouter"));
const authenticate_1 = __importDefault(require("./router/authenticate"));
const conversationRouter_1 = __importDefault(require("./router/conversationRouter"));
const userRouter_1 = __importDefault(require("./router/userRouter"));
const messageRouter_1 = __importDefault(require("./router/messageRouter"));
const notificationRouter_1 = __importDefault(require("./router/notificationRouter"));
const bodyParser = require("body-parser");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const HttpError_1 = require("./models/HttpError");
const CustomValidationError_1 = require("./models/CustomValidationError");
const logger_1 = __importDefault(require("./common/logger"));
const constants_1 = require("./common/constants");
// import { socketVerifyToken } from "./middlewares/authenticate";
const socket_1 = require("./socket");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app = (0, express_1.default)();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, "assets")));
app.use((0, cors_1.default)());
app.use(bodyParser.json());
app.set(constants_1.SOCKET_LIST, null);
require("dotenv").config();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
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
(0, socket_1.SocketWithoutAuthenticate)(io);
io.sockets.on("connection", (socket) => {
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
    socket.once(constants_1.SOCKET_ON_ACTIONS.ON_AUTHENTICATE, (data) => {
        jsonwebtoken_1.default.verify(data.token, process.env.TOKEN_SECRET, (err, decode) => {
            if (err) {
                console.log(err);
            }
            else {
                socket.data.decode = decode;
                io._nsps.forEach((nsp) => {
                    nsp.sockets.forEach((_socket) => {
                        if (_socket.id === socket.id)
                            nsp.sockets.set(socket.id, socket);
                    });
                });
            }
        });
    });
    // if socket didnt authenticate just disconnect it else call another socket with parse info
    setTimeout(() => {
        if (socket.data.decode) {
            socket.emit(constants_1.SOCKET_EMIT_ACTIONS.AUTHEN_SUCCESS);
            const socketList = (0, socket_1.socketManager)(io, socket.data.decode);
            app.set(constants_1.SOCKET_LIST, socketList);
        }
        else {
            app.set(constants_1.SOCKET_LIST, null);
            socket.emit(constants_1.SOCKET_EMIT_ACTIONS.AUTHEN_FAIL);
            socket.disconnect();
        }
    }, 1000);
});
app.use("/upload", uploadFileRouter_1.default);
app.use("/authen", authenticate_1.default);
app.use("/user", userRouter_1.default);
app.use("/conversation", conversationRouter_1.default);
app.use("/message", messageRouter_1.default);
app.use("/notification", notificationRouter_1.default);
// localhost:300/authen/signup
app.get("/cook", (req, res) => {
    res.cookie("cook", "hyy").json({ name: req.hostname });
});
// Error handle
app.use((err, req, res, next) => {
    logger_1.default.err(err, true);
    if (err instanceof HttpError_1.HttpError) {
        res.status(err.status | constants_1.BAD_REQUEST).json({
            message: err.message,
        });
    }
    else if (err instanceof CustomValidationError_1.CustomValidationError) {
        console.log(err);
        res.status(err.status | constants_1.INTERNAL_SERVER).json({
            message: err.message,
            errors: err,
        });
    }
    else {
        res.status(constants_1.BAD_REQUEST).json({
            message: err.message || "Unexpected error",
        });
    }
});
server.listen(process.env.PORT || 3001, () => {
    console.log("Hello world", process.env.PORT);
});
// mysqldump --column-statistics=0 --routines -u root -p  chat_app > filename.sql
