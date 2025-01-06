import express from "express"
import { authorizedRoles, isLoggedIn } from "../middlewares/auth.middleware.js";
import { contactUs, userStats } from "../controllers/miscellaneous.controllers.js"

const misRouter = express.Router();

misRouter.route('/contact').post(contactUs)
misRouter.route('/admin/stats/users').get(isLoggedIn, authorizedRoles('ADMIN'), userStats)

export default misRouter;