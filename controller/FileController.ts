import {
  DEL_FLAG,
  BAD_REQUEST,
  REQUEST_SUCCESS,
  VALIDATION_STATUS,
  DB_ERROR,
} from "../common/constants";
import { NextFunction, Request, Response } from "express";
import { FileDao } from "../Dao/FileDao";
import { IconCreateRequest } from "../TS/File";
import { createIconSchema } from "../validations/File";
import * as yup from "yup";
import { CustomValidationError } from "../models/CustomValidationError";
import { unlinkSync } from "fs";
import {
  throwValidateError,
  throwNormalError,
  throwHttpError,
} from "../common/functions";
export class FileControler {
  private FileDao: FileDao;
  constructor() {
    this.FileDao = new FileDao();
    this.getIconById = this.getIconById.bind(this);
    this.insertIcon = this.insertIcon.bind(this);
  }

  public async getIconById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.FileDao.getIconById(id);
      res.json({ icon: result });
    } catch (e) {
      res.json({ icon: null });
    }
  }

  public async validateIcon(
    req: IconCreateRequest,
    res: Response,
    next: NextFunction
  ) {
    const {
      blocksOfWidth,
      blocksOfHeight,
      width,
      height,
      totalFrames,
      categoryCd,
    } = req.body;
    try {
      await createIconSchema.validate(
        {
          blocksOfWidth,
          blocksOfHeight,
          width,
          height,
          totalFrames,
          categoryCd,
        },
        {
          abortEarly: false,
        }
      );
      next();
    } catch (error: any) {
      const image: any = req?.files;
      if (req.iconInfo) {
        const segment = req.iconInfo[0].imgLink.split("/");
        unlinkSync(`./assets/icon/${segment[segment.length - 1]}`);
      }

      throwValidateError(error, next);
    }
  }

  public async insertIcon(
    req: IconCreateRequest,
    res: Response,
    next: NextFunction
  ) {
    const {
      url,
      blocksOfWidth,
      blocksOfHeight,
      width,
      height,
      totalFrames,
      categoryCd,
    } = req.body;

    if (!!req.iconInfo) {
      try {
        const result = await this.FileDao.createIcon({
          url: req.iconInfo[0].imgLink,
          blocksOfWidth,
          blocksOfHeight,
          width,
          height,
          totalFrames,
          categoryCd,
        });
        res.status(REQUEST_SUCCESS).json({ message: "Created" });
      } catch (e) {
        throwHttpError(DB_ERROR, BAD_REQUEST, next);
      }
    } else {
      throwNormalError("Image required", next);
    }
  }
}
