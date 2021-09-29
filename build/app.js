"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const uploadFileRouter_1 = __importDefault(require("./router/uploadFileRouter"));
const bodyParser = require("body-parser");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const HttpError_1 = require("./models/HttpError");
const CustomValidationError_1 = require("./models/CustomValidationError");
const logger_1 = __importDefault(require("./common/logger"));
const constants_1 = require("./common/constants");
const app = (0, express_1.default)();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, "assets")));
app.use((0, cors_1.default)());
app.use(bodyParser.json());
require("dotenv").config();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
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
function LoginSocket(io, socket) {
    socket.on("Hello", (data) => __awaiter(this, void 0, void 0, function* () {
        yield new Promise((resolve) => {
            setTimeout(() => {
                // console.log("ok", data);
                resolve(1000);
            }, 1000);
        });
    }));
}
io.on("connection", (socket) => {
    LoginSocket(io, socket);
    socket.on("Hello2", (data) => __awaiter(void 0, void 0, void 0, function* () { }));
    // socket.emit("Bat",{name:"huy"})
});
// io.of("/namespace").on("connection",(socket:Socket)=>{
// console.log(socket.id);
// socket.on("name1",(data)=>{
//     console.log(data);
//     console.log("namespace ok");
// })
// })
app.use("/upload", uploadFileRouter_1.default);
app.get("/cook", (req, res) => {
    res.cookie("cook", "hyy").json({ name: req.hostname });
});
app.use((err, req, res, next) => {
    logger_1.default.err(err, true);
    if (err instanceof HttpError_1.HttpError) {
        res.status(err.status | constants_1.BAD_REQUEST).json({
            message: err.message,
        });
    }
    else if (err instanceof CustomValidationError_1.CustomValidationError) {
        res.status(err.status | constants_1.INTERNAL_SERVER).json({
            message: err.message,
            errors: err.fieldsError,
        });
    }
    else {
        res.status(constants_1.BAD_REQUEST).json({
            message: err.message || "Unexpected error",
        });
    }
});
server.listen(process.env.PORT || 3001, () => {
    console.log("Hello world");
});
