"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
// var connection=mysql.createConnection({
//   host:"171.241.46.90",
//   // host:"localhost",
//   user: "root",
//   password: "huyhoang10032000@gmail.com",
//   database: "chat_app",
//   port: 3306,
// });
// connection.connect((err:mysql.MysqlError) => {
//   if (err) {
//     console.log("Server connect error");
//     console.log(err);
//   } else {
//     console.log("Database established");
//   }
// });
// const options = {
//   // responseType: 'text',
//   headers: {
//     'user-agent':'Node-NoIP/v' + "1.0.2" + ' ' +"huyred1003@gmail.com"
//   },
//   auth: {
//     username: "huyred1003@gmail.com",
//     password: "H1u2y3123"
//   },
//   params: {
//     hostname:"socketservercn11.ddns.net"
//   }
// }
// axios.get('https://dynupdate.no-ip.com/nic/update',{...options}).then((response)=>{
//   const ip=response.data.split(" ")[1].replace(/(\r\n|\n|\r)/gm, "");
//   connection= mysql.createConnection({
//     host:ip,
//     user: "root",
//     password: "",
//     database: "chat_app",
//     port: 3306,
//   });
//   connection.connect((err:mysql.MysqlError) => {
//     if (err) {
//       console.log("Server connect error");
//       console.log(err);
//     } else {
//       console.log("Database established");
//     }
//   });
// })
let _connection = null;
let pool = mysql_1.default.createPool({
    connectionLimit: 2,
    host: "171.241.46.90",
    // host:"localhost",
    user: "root",
    password: "huyhoang10032000@gmail.com",
    database: "chat_app",
    port: 3306,
    acquireTimeout: 1200000,
});
// pool.getConnection((err: mysql.MysqlError, connection: Connection) => {
//   if (err) {
//     console.log("Server connect error");
//     // pool.
//   } else {
//     _connection = connection;
//     console.log("Database established");
//   }
// });
const handleReconnect = (pool) => {
    pool.getConnection((err, connection) => {
        if (err) {
            const _a = pool.config, { connectionConfig } = _a, rest = __rest(_a, ["connectionConfig"]);
            console.log("Server connect error");
            console.log(err);
            handleReconnect(mysql_1.default.createPool(Object.assign(Object.assign({}, connectionConfig), rest)));
        }
        else {
            _connection = connection;
            console.log("Database established");
        }
    });
};
handleReconnect(pool);
exports.default = _connection;
