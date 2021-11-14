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
exports.BaseDao = void 0;
const db_1 = __importDefault(require("../common/db"));
class BaseDao {
    // protected pool: Pool;
    // private handleReconnect = (pool: Pool) => {
    //   pool.getConnection((err: mysql.MysqlError, connection: Connection) => {
    //     if (err) {
    //       const { connectionConfig, ...rest } = pool.config;
    //       console.log("Server connect error");
    //       console.log(err);
    //       this.handleReconnect(
    //         mysql.createPool({ ...connectionConfig, ...rest })
    //       );
    //     } else {
    //       this.db = connection;
    //       // _connection = connection;
    //       console.log("Database established");
    //     }
    //   });
    // };
    // handleReconnect(pool);
    constructor() {
        this.db = db_1.default;
        // this.handleReconnect(connection);
        // this.db = connection as Connection;
    }
    initConnection() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    getConnection() {
        return this.db;
    }
}
exports.BaseDao = BaseDao;
