import path from "path";
import { NextFunction, Response } from "express";
import { ValidationError } from "yup";
import { CustomValidationError } from "../models/CustomValidationError";
import { HttpError } from "../models/HttpError";
import jwt from "jsonwebtoken";
require("dotenv").config();

import { VALIDATION_ERROR, VALIDATION_STATUS } from "../common/constants";
const getExtension = (filename: string) => {
  var ext = path.extname(filename || "").split(".");
  return ext[ext.length - 1];
};

const randomId = (length: number) => {
  var result = [];
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength))
    );
  }
  return result.join("");
};

const bindLocals = (res: Response, data: any) => {
  res.locals = data;
};

const throwValidateError = (error: ValidationError, next: NextFunction) => {
  next(
    new CustomValidationError(
      VALIDATION_ERROR,
      VALIDATION_STATUS,
      error.inner.map((err) => {
        return {
          field: err.path || "",
          errors: err.errors || [],
        };
      })
    )
  );
};

const throwNormalError = (message:string,next: NextFunction) => {
  next(new Error("Unexpected error"));
};

const throwHttpError = (
  message: string,
  status: number,
  next: NextFunction
) => {
  next(new HttpError(message, status));
};

const generateAccessToken = (input:any) => {
  const tokenExpireTime = Date.now() + parseInt(process.env.TOKEN_EXPIRE_TIME as string);
  return jwt.sign({ ...input, tokenExpireTime }, process.env.TOKEN_SECRET as string
      , { algorithm: 'HS256', expiresIn: parseInt(process.env.TOKEN_EXPIRE_TIME as string) / 1000, })

  // process.env.TOKEN_EXPIRE_TIME / 1000
}

const generateRefreshToken = (input:any) => {
  const refrestTokenExpireTime = Date.now() + parseInt(process.env.REFRESH_TOKEN_EXPIRE_TIME as string);
  return jwt.sign({ ...input, refrestTokenExpireTime },
      process.env.REFRESH_TOKEN_SECRET as string,
      { algorithm: 'HS256', expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRE_TIME as string) / 1000 })
  // process.env.REFRESH_TOKEN_EXPIRE_TIME / 1000
}

export {
  randomId,
  getExtension,
  bindLocals,
  throwValidateError,
  throwHttpError,
  throwNormalError,
  generateAccessToken,
  generateRefreshToken
};
