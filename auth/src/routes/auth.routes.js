const express = require("express");
const validators = require("../middlewares/validator.middleware");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Registration route
router.post(
  "/register",
  validators.registerUserValidations,
  authController.registerUser
);

// Login route
router.post(
  "/login",
  validators.loginUserValidations,
  authController.loginUser
);

// GET /api/auth/me - Get current user info
router.get("/me", authMiddleware.authMiddleware, authController.getCurrentUser);

// GET /api/auth/logout - Logout user
router.get("/logout", authController.logoutUser);

router.get(
  "/users/me/addresses",
  authMiddleware.authMiddleware,
  authController.getUserAdresses
);

router.post(
  "/users/me/addresses",
  authMiddleware.authMiddleware,
  authController.addUserAddress
);

router.delete(
  "/users/me/addresses/:addressId",
  authMiddleware.authMiddleware,
  authController.deleteUserAdresses
);

module.exports = router;
