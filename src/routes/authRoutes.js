import express from "express";
import authController from "../controllers/authController.js";
 import {
    validateRegister,
    validateLogin,

 } from "../middleware/authValidation.js";
 import validate from "../middleware/validationResult.js";
 const router =express.Router();
 router.post("/register",
    validateRegister,
    validate,

    authController.registerUser);
 router.post("/login",
    validateLogin,
    validate,
    authController.loginUser);
 

  export default router;
