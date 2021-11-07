import { BaseDao } from "./BaseDao";
import Icon from "../models/Icon";
import IconCategory from "../models/IconCategory";
import { DEL_FLAG } from "../common/constants";
export class FileDao extends BaseDao {
  constructor() {
    super();
  }

  public getListIconCategory() {
    return new Promise<IconCategory>((resolve, reject) => {
      this.db.query(
        `SELECT * FROM icon_category WHERE delFlag=${DEL_FLAG.VALID}`,
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }

  public getIconByCategory(id_category: string) {
    return new Promise<Icon>((resolve, reject) => {
      this.db.query(
        `
      SELECT icon.*,
        icon_category.name as categoryLabel,
        icon_category.delFlag as categoryDelFlag,
        icon_category.createAt as categoryCreateAt
         FROM icon INNER JOIN icon_category ON icon.category=icon_category.id AND icon_category.id=?
         AND icon.delFlag=${DEL_FLAG.VALID} AND icon_category.delFlag=${DEL_FLAG.VALID}
      `,
        [id_category],
        (err, result) => {
          if (err) reject(err);
          else {
            resolve(
              result.map((icon: any) => ({
                id_icon: icon.id_icon,
                url: icon.url,
                delFlag: icon.delFlag,
                blocksOfWidth: icon.blocksOfWidth,
                blocksOfHeight: icon.blocksOfHeight,
                width: icon.width,
                height: icon.height,
                totalFrames: icon.totalFrames,
                createAt: icon.createAt ? new Date(icon.createAt) : null,
                category: {
                  id: icon.category,
                  name: icon.categoryLabel,
                  delFlag: icon.categoryDelFlag,
                  createAt: icon.categoryCreateAt
                    ? new Date(icon.categoryCreateAt)
                    : null,
                },
              }))
            );
          }
        }
      );
    });
  }

  public getIconById(id: string) {
    return new Promise<Icon | null>((resolve, reject) => {
      this.db.query(
        `SELECT icon.*,
        icon_category.name as categoryLabel,
        icon_category.delFlag as categoryDelFlag,
        icon_category.createAt as categoryCreateAt
         FROM icon INNER JOIN icon_category ON icon.category=icon_category.id AND id_icon=? AND icon.delFlag=${DEL_FLAG.VALID} AND icon_category.delFlag=${DEL_FLAG.VALID} LIMIT 1`,
        [id],
        (err, result) => {
          if (err) reject(err);
          else {
            if (result.length > 0) {
              const icon = result[0];
              resolve({
                id_icon: icon.id_icon,
                url: icon.url,
                delFlag: icon.delFlag,
                blocksOfWidth: icon.blocksOfWidth,
                blocksOfHeight: icon.blocksOfHeight,
                width: icon.width,
                height: icon.height,
                totalFrames: icon.totalFrames,
                createAt: icon.createAt ? new Date(icon.createAt) : null,
                category: {
                  id: icon.category,
                  name: icon.categoryLabel,
                  delFlag: icon.categoryDelFlag,
                  createAt: icon.categoryCreateAt
                    ? new Date(icon.categoryCreateAt)
                    : null,
                },
              });
            } else resolve(null);
          }
        }
      );
    });
  }

  public createIcon(
    iconInfo: Omit<Icon, "delFlag" | "id_icon" | "category" | "createAt"> & {
      categoryCd: string;
    }
  ) {
    return new Promise((resolve, reject) => {
      const {
        url,
        blocksOfWidth,
        blocksOfHeight,
        width,
        height,
        totalFrames,
        categoryCd,
      } = iconInfo;
      this.db.query(
        `INSERT INTO icon(iconUrl,blocksOfWidth,blocksOfHeight,width,height,totalFrames,createAt,category) 
    VALUES(?,?,?,?,?,?,now(),?)`,
        [
          url,
          blocksOfWidth,
          blocksOfHeight,
          width,
          height,
          totalFrames,
          categoryCd,
        ],
        (err, result) => {
          if (err) {
            reject(err);
          } else resolve("ok");
        }
      );
    });
  }
}
