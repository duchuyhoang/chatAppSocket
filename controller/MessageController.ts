import { NextFunction,Response,Request } from "express";
import {MessageDao} from "../Dao/MessageDao";
import { SendMessageSchema } from "../validations/Message";
import {uploadMultipleImage} from "../common/functions";
export class MessageController{
private messageDao:MessageDao;

constructor(){
    this.messageDao=new MessageDao();
    this.insertNewMessage=this.insertNewMessage.bind(this);
}


public async insertNewMessage(req: Request, res: Response,next: NextFunction){

console.log(res.locals.imageInfo);


try{
// const listLink=await uploadMultipleImage()

}
catch(err){

}

res.json({message:"dadad"});


}


}