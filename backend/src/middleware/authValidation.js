import { body } from "express-validator";
export const validateRegister=[
    body("name")
    .trim()
    .notEmpty()
    .withMessage("name is required")
    .isLength({min:2})
    .withMessage("name must be at least 2 character long"),
    body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required")
.isEmail()
    .withMessage("please provide a valid email"),

    body("password")
    .notEmpty()
    .withMessage("password  is required")
    .isLength({min:6})
    .withMessage("password must me at least 6 character long"),

];

 export const validateLogin =[
    body("email")
    .trim()
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("please provide a valid email "),
    body("password")
    .notEmpty()
    .withMessage("password is required"),
 ];
