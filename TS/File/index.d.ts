import { Request,Express } from "express";
interface BaseImage {
  originalFile:Express.Multer.File;
  imgId: string;
  imgLink: string;
  newName:string;
  mimetype:string;
  buffer: Buffer;
}

export interface ImageInfo extends  BaseImage{}
export interface IconInfo extends  BaseImage{}

export interface IconCreateRequest extends Request {
iconInfo?:null|IconInfo[],
}
