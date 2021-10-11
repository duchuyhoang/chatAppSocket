"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMessageSchema = void 0;
const yup = __importStar(require("yup"));
const constants_1 = require("../common/constants");
exports.SendMessageSchema = yup.object().shape({
    content: yup.string().max(255, "Max string length "),
    id_conversation: yup.string().required("Conversation required"),
    type: yup
        .string()
        .required("Type message required")
        .test("Wrong message type error", "Wrong message type", (value) => {
        let pass = false;
        Object.keys(constants_1.MESSAGE_TYPE).forEach((key) => {
            if (constants_1.MESSAGE_TYPE[key].toString() === (value === null || value === void 0 ? void 0 : value.toString())) {
                pass = true;
            }
        });
        return pass;
    }),
});
