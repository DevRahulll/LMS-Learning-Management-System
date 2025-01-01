import express from "express";
import { addLecturesToCourseById, createCourse, getAllCourses, getLecturesbyCourseId, removeCourse, updateCourse } from "../controllers/course.controllers.js";
import { authorizedRoles, authorizeSubscriber, isLoggedIn } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middlewares.js";

const courseRouter = express.Router();

courseRouter.route('/')
    .get(isLoggedIn, getAllCourses)
    .post(isLoggedIn, authorizedRoles('ADMIN'), upload.single('thumbnail'), createCourse)

courseRouter.route('/:id')
    .get(isLoggedIn, authorizeSubscriber, getLecturesbyCourseId)
    .put(isLoggedIn, authorizedRoles('ADMIN'), updateCourse)
    .delete(isLoggedIn, authorizedRoles('ADMIN'), removeCourse)
    .post(isLoggedIn, authorizedRoles('ADMIN'), upload.single('lecture'), addLecturesToCourseById)

export default courseRouter;

