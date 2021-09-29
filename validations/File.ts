import * as yup from "yup";


export const createIconSchema=yup.object().shape({
    blocksOfWidth: yup.number().typeError("Must be a number").required("Required"),
    blocksOfHeight: yup.number().typeError("Must be a number").required("Required"),
    width: yup.number().typeError("Must be a number").required("Required"),
    height: yup.number().typeError("Must be a number").required("Required"),
    totalFrames: yup.number().typeError("Must be a number").required("Required"),
    categoryCd:yup.number().required("Required").typeError("Must be a number"),
})