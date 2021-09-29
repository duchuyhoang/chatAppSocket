"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthenticationController_1 = require("../controller/AuthenticationController");
const authenticationRouter = express_1.default.Router();
authenticationRouter.post("/login", new AuthenticationController_1.AuthenticationController().login);
