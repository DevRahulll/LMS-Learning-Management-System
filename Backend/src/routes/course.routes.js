import express from "express";
import { createCourse, getAllCourses, getLecturesbyCourseId, removeCourse, updateCourse } from "../controllers/course.controllers.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middlewares.js";

const courseRouter = express.Router();

courseRouter.route('/')
    .get(isLoggedIn, getAllCourses)
    .post(upload.single('thumbnail'), createCourse)

courseRouter.route('/:id')
    .get(isLoggedIn, getLecturesbyCourseId)
    .put(updateCourse)
    .delete(removeCourse)

export default courseRouter;

