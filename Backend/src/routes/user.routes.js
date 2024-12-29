import express from "express"
import { forgotPassword, getProfile, login, logout, register, resetPassword } from "../controllers/user.controllers.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middlewares.js";

const router = express.Router();

router.route('/register').post(upload.single("avatar"), register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/me').get(isLoggedIn, getProfile);
router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password').post(resetPassword)

export default router;