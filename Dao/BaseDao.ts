import connection from "../common/db";
// import { Connection } from "mysql";
import mysql, { Connection, Pool } from "mysql";
export class BaseDao {
  protected db: Connection;
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
    this.db = connection ;
    // this.handleReconnect(connection);
    // this.db = connection as Connection;
  }

  async initConnection() {}

  public getConnection() {
    return this.db;
  }
}
