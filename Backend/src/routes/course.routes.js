import express from "express";
import { addLecturesToCourseById, createCourse, deleteCourseById, getAllCourses, getLecturesbyCourseId, removeLectureFromCourse, updateCourse } from "../controllers/course.controllers.js";
import { authorizedRoles, authorizeSubscriber, isLoggedIn } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middlewares.js";

const courseRouter = express.Router();

courseRouter.route('/')
    .get(getAllCourses)
    .post(
        isLoggedIn,
        authorizedRoles('ADMIN'),
        upload.single('thumbnail'),
        createCourse
    )
    .delete(isLoggedIn, authorizedRoles('ADMIN'), removeLectureFromCourse)

courseRouter.route('/:id')
    .get(isLoggedIn, authorizeSubscriber, getLecturesbyCourseId)
    .put(isLoggedIn, authorizedRoles('ADMIN'), updateCourse)
    .post(
        isLoggedIn,
        authorizedRoles('ADMIN'),
        upload.single('lecture'),
        addLecturesToCourseById
    )
    .delete(isLoggedIn, authorizedRoles('ADMIN'), deleteCourseById)

export default courseRouter;

