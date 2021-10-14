import * as yup from "yup";
import { MESSAGE_TYPE } from "../common/constants";

export const SendMessageSchema = yup.object().shape({
  content: yup.string().max(255,"Max string length "),
  id_conversation: yup.string().required("Conversation required"),
  type: yup
    .string()
    .required("Type message required")
    .test("Wrong message type error", "Wrong message type", (value) => {
      let pass = false;
      Object.keys(MESSAGE_TYPE).forEach((key: any) => {
        if (MESSAGE_TYPE[key].toString() === value?.toString()) {
          pass = true;
        }
      });

      return pass;
    }),
});


export const GetMessageSchema=yup.object().shape({
  limit:yup.number().min(1,"Need at least 1").max(30,"Max 30 messages").required("Need a number").typeError('Need a number'),
  offset:yup.number().min(0,"Need at least 0").required("Need a number").typeError('Need a number')
})
