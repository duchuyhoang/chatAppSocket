"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindSocketData = exports.checkSocketsEstablished = exports.verifyToken = void 0;
const constants_1 = require("../common/constants");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = (authHeader && authHeader.split(" ")[1]) || null;
    if (token === null || token === "" || token === undefined)
        res.status(401).json({ message: "Unauthorized" });
    else {
        jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET, (err, decode) => {
            if (err) {
                res.status(constants_1.UNAUTHORIZED).json({ message: "Unauthorized" });
            }
            else {
                // Return a old token info
                res.locals.decodeToken = decode;
                next();
            }
        });
    }
};
exports.verifyToken = verifyToken;
const checkSocketsEstablished = (req, res, next) => {
    if (req.app.get(constants_1.SOCKET_LIST)) {
        next();
    }
    else {
        res.status(constants_1.FORBIDDEN).json({ message: "Socket established failed" });
    }
};
exports.checkSocketsEstablished = checkSocketsEstablished;
const bindSocketData = (decodeData) => {
    return (socket, next) => {
        if (decodeData) {
            socket.data.decode = decodeData;
            next();
        }
    };
};
exports.bindSocketData = bindSocketData;
