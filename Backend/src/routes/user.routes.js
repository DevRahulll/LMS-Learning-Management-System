import express from "express"
import { ChangePassword, forgotPassword, getProfile, login, logout, register, resetPassword, updateUser } from "../controllers/user.controllers.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middlewares.js";

const router = express.Router();

router.route('/register').post(upload.single("avatar"), register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/me').get(isLoggedIn, getProfile);
router.route('/reset').post(forgotPassword);
router.route('/reset/:resetToken').post(resetPassword);
router.route('/change-password').post(isLoggedIn, ChangePassword);
router.route('/update').put(isLoggedIn, upload.single("avatar"), updateUser)

export default router;