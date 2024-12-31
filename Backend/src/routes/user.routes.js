import express from "express"
import { ChangePassword, forgotPassword, getProfile, login, logout, register, resetPassword, updateUser } from "../controllers/user.controllers.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middlewares.js";

const Userrouter = express.Router();

Userrouter.route('/register').post(upload.single("avatar"), register);
Userrouter.route('/login').post(login);
Userrouter.route('/logout').get(logout);
Userrouter.route('/me').get(isLoggedIn, getProfile);
Userrouter.route('/reset').post(forgotPassword);
Userrouter.route('/reset/:resetToken').post(resetPassword);
Userrouter.route('/change-password').post(isLoggedIn, ChangePassword);
Userrouter.route('/update').put(isLoggedIn, upload.single("avatar"), updateUser)

export default Userrouter;