import connection from "../common/db";
import { Connection } from "mysql";
export class BaseDao {
  protected db: Connection;
  constructor() {
    this.db = connection;
  }
  public getConnection() {
    return this.db;
  }
}
