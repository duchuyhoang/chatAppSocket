import { BaseDao } from "./BaseDao";
import {MESSAGE_TYPE} from "../common/constants";
import {IInsertIconMessage,IInsertTextMessage,IInsertImageMessage} from "../models/Message";
export class MessageDao extends BaseDao {

    public insertNewMessage=()=>{

    }


public insertNewTextMessage(newMessage:IInsertTextMessage){
    
}
public insertNewImageMessage(newImage:IInsertImageMessage){

}


}
