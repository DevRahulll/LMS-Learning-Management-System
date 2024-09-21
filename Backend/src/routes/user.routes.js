import express from "express"
import { getProfile, login, logout, register } from "../controllers/user.controllers.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middlewares.js";

const router=express.Router();

router.route('/register').post(upload.single("avatar"),register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/me').get(isLoggedIn ,getProfile);

export default router;