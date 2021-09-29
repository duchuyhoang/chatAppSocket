"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1] || null;
    if (token === null || token === "" || token === undefined)
        res.status(401).json({ message: "Unauthorized" });
    else {
        jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET, (err, decode) => {
            // console.log("decode",decode);
            if (err) {
                res.status(401).json({ message: "Unauthorized" });
            }
            else {
                req.body.id = (decode === null || decode === void 0 ? void 0 : decode.id) || null;
                req.body.email = (decode === null || decode === void 0 ? void 0 : decode.email) || null;
                // Return a old token info
                res.locals.oldTokenInfo = decode;
                // req.body.oldTokenInfo = decode;
                // req.oldTokenInfo=decode;
                next();
            }
        });
    }
};
exports.verifyToken = verifyToken;
