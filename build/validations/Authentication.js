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
exports.SignupSchema = exports.LoginSchema = void 0;
const yup = __importStar(require("yup"));
const constants_1 = require("../common/constants");
exports.LoginSchema = yup.object().shape({
    email: yup.string().email("Need to be an email").required("Email required"),
    password: yup.string().required("Password required")
});
exports.SignupSchema = yup.object().shape({
    email: yup.string().email("Need to be an email").required("Email required"),
    password: yup.string().required("Password required"),
    phone: yup.string().required("Phone required").matches(constants_1.VALIDATION_PHONE_REGEX, "Phone wron format"),
    name: yup.string().required("Name required"),
    sex: yup.number().required("Sex required").min(0, "Must between 0 1").max(1, "Must between 0 1"),
});
