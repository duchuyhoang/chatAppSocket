import * as yup from "yup";
import { NOTIFICATION_TYPE } from "../common/constants";

export const CreateNotificationSchema = yup.object().shape({
  type: yup
    .string()
    .test("Wrong notification type", "Wrong notification type", (value) => {
      const type: any = NOTIFICATION_TYPE;
      const listAcceptValue = Object.keys(type).map((key) =>
        type[key].toString()
      );
      return listAcceptValue.indexOf(value?.toString() || "") != -1;
    }),
id_receiver:yup.string().required('Need someone'),



});
