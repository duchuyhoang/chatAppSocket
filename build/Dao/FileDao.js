"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileDao = void 0;
const BaseDao_1 = require("./BaseDao");
const constants_1 = require("../common/constants");
class FileDao extends BaseDao_1.BaseDao {
    constructor() {
        super();
    }
    getListIconCategory() {
        return new Promise((resolve, reject) => {
            this.db.query(`SELECT * FROM icon_category WHERE delFlag=${constants_1.DEL_FLAG.VALID}`, (err, result) => {
                if (err)
                    reject(err);
                else
                    resolve(result);
            });
        });
    }
    getIconByCategory(id_category) {
        return new Promise((resolve, reject) => {
            this.db.query(`
      SELECT icon.*,
        icon_category.name as categoryLabel,
        icon_category.delFlag as categoryDelFlag,
        icon_category.createAt as categoryCreateAt
         FROM icon INNER JOIN icon_category ON icon.category=icon_category.id AND icon_category.id=?
         AND icon.delFlag=${constants_1.DEL_FLAG.VALID} AND icon_category.delFlag=${constants_1.DEL_FLAG.VALID}
      `, [id_category], (err, result) => {
                if (err)
                    reject(err);
                else {
                    resolve(result.map((icon) => ({
                        id_icon: icon.id_icon,
                        iconUrl: icon.iconUrl,
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
                    })));
                }
            });
        });
    }
    getIconById(id) {
        return new Promise((resolve, reject) => {
            this.db.query(`SELECT icon.*,
        icon_category.name as categoryLabel,
        icon_category.delFlag as categoryDelFlag,
        icon_category.createAt as categoryCreateAt
         FROM icon INNER JOIN icon_category ON icon.category=icon_category.id AND id_icon=? AND icon.delFlag=${constants_1.DEL_FLAG.VALID} AND icon_category.delFlag=${constants_1.DEL_FLAG.VALID} LIMIT 1`, [id], (err, result) => {
                if (err)
                    reject(err);
                else {
                    if (result.length > 0) {
                        const icon = result[0];
                        resolve({
                            id_icon: icon.id_icon,
                            iconUrl: icon.iconUrl,
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
                    }
                    else
                        resolve(null);
                }
            });
        });
    }
    createIcon(iconInfo) {
        return new Promise((resolve, reject) => {
            const { iconUrl, blocksOfWidth, blocksOfHeight, width, height, totalFrames, categoryCd, } = iconInfo;
            this.db.query(`INSERT INTO icon(iconUrl,blocksOfWidth,blocksOfHeight,width,height,totalFrames,createAt,category) 
    VALUES(?,?,?,?,?,?,now(),?)`, [
                iconUrl,
                blocksOfWidth,
                blocksOfHeight,
                width,
                height,
                totalFrames,
                categoryCd,
            ], (err, result) => {
                if (err) {
                    reject(err);
                }
                else
                    resolve("ok");
            });
        });
    }
}
exports.FileDao = FileDao;
