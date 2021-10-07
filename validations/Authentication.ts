import * as yup from "yup";
import {VALIDATION_PHONE_REGEX} from "../common/constants";
export const LoginSchema=yup.object().shape({
    email:yup.string().email("Need to be an email").required("Email required"),
    password:yup.string().required("Password required")
})

export const SignupSchema=yup.object().shape({
    email:yup.string().email("Need to be an email").required("Email required"),
    password:yup.string().required("Password required"),
    phone:yup.string().required("Phone required").matches(VALIDATION_PHONE_REGEX,"Phone wron format"),
    name:yup.string().required("Name required"),
    sex:yup.number().required("Sex required").min(0,"Must between 0 1").max(1,"Must between 0 1"),

})