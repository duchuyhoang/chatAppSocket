import { Request } from "express";

interface BaseImage {
  imgId: string;
  imgLink: string;
}

export interface ImageInfo extends  BaseImage{}
export interface IconInfo extends  BaseImage{}

export interface IconCreateRequest extends Request {
iconInfo?:null|IconInfo[],
}
