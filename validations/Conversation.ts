import * as yup from "yup";

export const ConversationCreateGroupChatSchema = yup.object().shape({
  title: yup.string().required("Need title"),
  // creator: yup.string().required("Creator required"),
  list_user: yup
    .string()
    .required("Need list user")
    .test("listUser", "List user wrong", (list_user: any) => {
      try {
        const list = JSON.parse(list_user);      
        return Array.isArray(list) && list?.length > 0;
      } catch (error) { 
        return false;
      }
    }),
});


export const ConversationCreatePrivateChatSchema=yup.object().shape({
  id_friend:yup.string().required("Must include a friend")
});

export const ConversationCheckPrivateChatExistSchema=yup.object().shape({
  id_friend:yup.string().required("Must include a friend")
})
// expot const ConversationGetMessageSchema