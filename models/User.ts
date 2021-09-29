import { DEL_FLAG } from "../common/constants";

export interface User{
    id_user:number,
    email:string,
    phone:string
    name:string
    delFlag:DEL_FLAG
    avatar:string
    createAt:Date
}