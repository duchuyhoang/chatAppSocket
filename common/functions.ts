import path from "path";
import { NextFunction, Response, Express } from "express";
import { ValidationError } from "yup";
import { CustomValidationError } from "../models/CustomValidationError";
import { HttpError } from "../models/HttpError";
import jwt from "jsonwebtoken";
import firebase from "../firebase/admin";
import { storageRef } from "../firebase/app";
import { uploadBytes, getDownloadURL } from "firebase/storage";
import { UploadMulterMemoryFile } from "./multer";
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

const throwNormalError = (message: string, next: NextFunction) => {
  next(new Error(message || "Unexpected error"));
};

const throwHttpError = (
  message: string,
  status: number,
  next: NextFunction
) => {
  next(new HttpError(message, status));
};

const generateAccessToken = (input: any) => {
  const tokenExpireTime =
    Date.now() + parseInt(process.env.TOKEN_EXPIRE_TIME as string);
  return jwt.sign(
    { ...input, tokenExpireTime },
    process.env.TOKEN_SECRET as string,
    {
      algorithm: "HS256",
      expiresIn: parseInt(process.env.TOKEN_EXPIRE_TIME as string) / 1000,
    }
  );

  // process.env.TOKEN_EXPIRE_TIME / 1000
};

const generateRefreshToken = (input: any) => {
  const refrestTokenExpireTime =
    Date.now() + parseInt(process.env.REFRESH_TOKEN_EXPIRE_TIME as string);
  return jwt.sign(
    { ...input, refrestTokenExpireTime },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      algorithm: "HS256",
      expiresIn:
        parseInt(process.env.REFRESH_TOKEN_EXPIRE_TIME as string) / 1000,
    }
  );
  // process.env.REFRESH_TOKEN_EXPIRE_TIME / 1000
};

// function translateToUploadFile(file:Express.Multer.File):UploadMulterMemoryFile{

// return {
// file,
// newName:
// }

// }

function toArrayBuffer(buf: Buffer) {
  var ab = new ArrayBuffer(buf.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return ab;
}
// fileName:string,mimetype:string,buffer:Buffer

async function uploadSingle(uploadedFile: UploadMulterMemoryFile) {
  const unit8Array = toArrayBuffer(uploadedFile.file.buffer);
  const result = await uploadBytes(
    storageRef(uploadedFile.newName),
    unit8Array
  );
  const link = await getDownloadURL(storageRef(uploadedFile.newName));
  return link;
}
async function uploadMultipleImage(listFile: UploadMulterMemoryFile[]) {
  // return new Promise<string[]>((resolve,reject) => {

  // })

  const listLink = Promise.all(listFile.map((file) => uploadSingle(file)));
  return listLink;
}

const forBulkInsert = <T>(dataList: Array<T>, insertedId: string) => {
  // imageList will be [[1,2,3],[1,4,5],[1,6,7]]
  // do this for bulk insert after
  let multidimensionArrayData: any[][] = [];
  dataList.forEach((data, _) => {
    let oneArrayData: any[] = [insertedId];
    for (let key in data) {
      oneArrayData.push(data[key]);
    }
    multidimensionArrayData.push(oneArrayData);
    // imageList will be [[1,2,3],[1,4,5],[1,6,7]]
    // do this for bulk insert after
  });

  return multidimensionArrayData;
};

const formatDate=(date:Date)=>{
  var dateStr =
  date.getFullYear() + "-" +
  ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
  ("00" + date.getDate()).slice(-2) + " " +
  ("00" + date.getHours()).slice(-2) + ":" +
  ("00" + date.getMinutes()).slice(-2) + ":" +
  ("00" + date.getSeconds()).slice(-2);
  return dateStr;
}


export {
  randomId,
  getExtension,
  bindLocals,
  throwValidateError,
  throwHttpError,
  throwNormalError,
  generateAccessToken,
  generateRefreshToken,
  uploadSingle,
  uploadMultipleImage,
  forBulkInsert,
  formatDate
  // translateToUploadFile
};
