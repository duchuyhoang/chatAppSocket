import { Maybe } from "yup/lib/types";
import { DEL_FLAG } from "../common/constants";

export interface User{
    id_user:number,
    email:string,
    phone:string
    name:string
    delFlag:DEL_FLAG
    avatar:string|null
    createAt:string
    password:string
    sex:number
    lastSeen:string
}

export type DecodedUser=Omit<User,"password">;

export interface IFriend extends User{
    friendShipStatus:number,
    updateAt:Maybe<string>,
    // online:boolean
}


export interface IUpdateUser{
    id_user:string,
    phone:string,
    name:string,
    avatar:string|null
    password:string
    sex:number
}