import AppError from "../utils/error.utils.js"
import cloudinary from "cloudinary"
import fs from "fs/promises"
import Course from "../models/course.models.js"


export const getAllCourses = async (req, res, next) => {
    try {
        const courses = await Course.find({}).select("-lectures");

        res.status(200).json({
            success: true,
            message: "Courses fetched successfully!",
            courses
        })
    } catch (error) {
        return next(
            new AppError(error.message, 500)
        )
    }
}

export const getLecturesbyCourseId = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return next(
                new AppError("Id is missing ", 500)
            )
        }

        const course = await Course.findById(id);
        if (!course) {
            return next(
                new AppError('Invalid course id', 400)
            )
        }

        res.status(200).json({
            success: true,
            message: "course lectures fetched successfully",
            lectures: course.lectures
        })
    } catch (error) {
        return next(
            new AppError(error.message, 500)
        )
    }
}

export const createCourse = async (req, res, next) => {
    const { title, description, category, createdBy } = req.body;
    if (!title || !description || !category || !createdBy) {
        return next(
            new AppError("All fields are required", 400)
        )
    }

    const course = await Course.create({
        title,
        description,
        category,
        createdBy
    });
    if (!course) {
        return next(
            new AppError("Course could not be created,please try again", 500)
        )
    }
}

export const updateCourse = async (req, res, next) => {

}

export const removeCourse = async (req, res, next) => {

}