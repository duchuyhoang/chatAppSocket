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
exports.CreateNotificationSchema = void 0;
const yup = __importStar(require("yup"));
const constants_1 = require("../common/constants");
exports.CreateNotificationSchema = yup.object().shape({
    type: yup
        .string()
        .test("Wrong notification type", "Wrong notification type", (value) => {
        const type = constants_1.NOTIFICATION_TYPE;
        const listAcceptValue = Object.keys(type).map((key) => type[key].toString());
        return listAcceptValue.indexOf((value === null || value === void 0 ? void 0 : value.toString()) || "") != -1;
    }),
    id_receiver: yup.string().required('Need someone'),
});
