import express from "express";
import {
  fotgotPassword,
  getUser,
  login,
  logout,
  register,
  resetPassword,
  updatePassword,
  updateProfile,
} from "../controller/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);
router.get("/getMe", isAuthenticated, getUser);
router.put("/update/me", isAuthenticated, updateProfile);
router.put("/update/password", isAuthenticated, updatePassword);
router.post("/password/forgot", fotgotPassword);
router.put("/password/reset/:token", resetPassword);

export default router;
