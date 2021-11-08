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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileControler = void 0;
const constants_1 = require("../common/constants");
const FileDao_1 = require("../Dao/FileDao");
const File_1 = require("../validations/File");
const functions_1 = require("../common/functions");
class FileControler {
    constructor() {
        this.FileDao = new FileDao_1.FileDao();
        this.getIconById = this.getIconById.bind(this);
        this.insertIcon = this.insertIcon.bind(this);
        this.getListIconCategory = this.getListIconCategory.bind(this);
        this.getIconByCategory = this.getIconByCategory.bind(this);
    }
    getIconById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield this.FileDao.getIconById(id);
                res.json({ icon: result });
            }
            catch (e) {
                res.json({ icon: null });
            }
        });
    }
    validateIcon(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { blocksOfWidth, blocksOfHeight, width, height, totalFrames, categoryCd, } = req.body;
            try {
                yield File_1.createIconSchema.validate({
                    blocksOfWidth,
                    blocksOfHeight,
                    width,
                    height,
                    totalFrames,
                    categoryCd,
                }, {
                    abortEarly: false,
                });
                next();
            }
            catch (error) {
                // const image: any = req?.files;
                // if (req.iconInfo) {
                //   const segment = req.iconInfo[0].imgLink.split("/");
                //   unlinkSync(`./assets/icon/${segment[segment.length - 1]}`);
                // }
                (0, functions_1.throwValidateError)(error, next);
                return;
            }
        });
    }
    insertIcon(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { blocksOfWidth, blocksOfHeight, width, height, totalFrames, categoryCd, } = req.body;
            try {
                if (!!req.iconInfo) {
                    const link = yield (0, functions_1.uploadSingle)({
                        file: req.iconInfo[0].originalFile,
                        newName: req.iconInfo[0].newName,
                    });
                    try {
                        const result = yield this.FileDao.createIcon({
                            iconUrl: link,
                            blocksOfWidth,
                            blocksOfHeight,
                            width,
                            height,
                            totalFrames,
                            categoryCd,
                        });
                        res.status(constants_1.REQUEST_SUCCESS).json({ message: "Created" });
                    }
                    catch (e) {
                        (0, functions_1.throwHttpError)(constants_1.DB_ERROR, constants_1.BAD_REQUEST, next);
                    }
                }
                else {
                    (0, functions_1.throwNormalError)("Image required", next);
                }
            }
            catch (error) {
                res.json({ error });
            }
        });
    }
    getListIconCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const listIconCategory = yield this.FileDao.getListIconCategory();
                res.json({ data: listIconCategory });
            }
            catch (error) {
                (0, functions_1.throwHttpError)(constants_1.DB_ERROR, constants_1.BAD_REQUEST, next);
            }
        });
    }
    getIconByCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const listIcon = yield this.FileDao.getIconByCategory(id);
                res.json({ data: listIcon });
            }
            catch (err) {
                (0, functions_1.throwHttpError)(constants_1.DB_ERROR, constants_1.BAD_REQUEST, next);
            }
        });
    }
}
exports.FileControler = FileControler;
