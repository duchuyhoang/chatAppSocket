"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseDao = void 0;
const db_1 = __importDefault(require("../common/db"));
class BaseDao {
    constructor() {
        this.db = db_1.default;
    }
    getConnection() {
        return this.db;
    }
}
exports.BaseDao = BaseDao;
