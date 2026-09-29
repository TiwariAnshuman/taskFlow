import express from "express";

import authController from "../controllers/authController.js";

import {
  validateRegister,
  validateLogin,
} from "../middleware/authValidation.js";

import validate from "../middleware/validationResult.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  validateRegister,
  validate,
  authController.registerUser
);

router.post(
  "/login",
  validateLogin,
  validate,
  authController.loginUser
);

// Current logged-in user
router.get(
  "/me",
  authMiddleware,
  authController.getCurrentUser
);

// Update current logged-in user
router.patch(
  "/me",
  authMiddleware,
  authController.updateCurrentUser
);
// Change password
router.patch(
  "/change-password",
  authMiddleware,
  authController.changePassword
);
router.delete(
  "/me",
  authMiddleware,
  authController.deleteAccount
);
export default router;