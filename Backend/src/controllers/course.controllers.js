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
        createdBy,
        thumbnail: {
            public_id: 'Dummy',
            secure_url: "dummy"
        }
    });
    if (!course) {
        return next(
            new AppError("Course could not be created,please try again", 500)
        )
    }

    if (req.file) {
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'lms'
            });
            if (result) {
                course.thumbnail.public_id = result.public_id;
                course.thumbnail.secure_url = result.secure_url;
            }

            fs.rm(`uploads/${req.file.filename}`)
        } catch (error) {
            return next(
                new AppError(error || 'Thumbnail not uploaded, please try again ', 500)
            )
        }
    }

    await course.save();

    res.status(200).json({
        success: true,
        message: 'Course created successfully!',
        course
    })
}

export const updateCourse = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return next(
                new AppError("Id is invalid or required", 500)
            )
        }
        const course = await Course.findByIdAndUpdate(
            id,
            {
                $set: req.body
            },
            {
                runValidators: true
            }
        )
        if (!course) {
            return next(
                new AppError("course with given id doesnot exist", 500)
            )
        }

        res.status(200).json({
            success: true,
            message: 'Course updated successfully!',
            course
        })

    } catch (error) {
        return next(
            new AppError(error.message, 500)
        )
    }
}

export const removeCourse = async (req, res, next) => {
    try {
        const { id } = req.params;

        const course = await Course.findById(id);

        if (!course) {
            return next(
                new AppError("No course found", 201)
            )
        }

        await Course.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'course deleted successfully!',
        })
    } catch (error) {
        return next(
            new AppError(error.message, 500)
        )
    }
}

export const addLecturesToCourseById = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const { id } = req.params
        if (!title || !description || !id) {
            return next(
                new AppError('All fields are required', 402)
            )
        }

        const course = await Course.findById(id);
        if (!course) {
            return next(
                new AppError('Course does not exist with this id', 402)
            )
        }

        const lectureData = {
            title,
            description,
            lecture:{}
        };

        if (req.file) {
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: 'lms'
                });
                if (result) {
                    lectureData.lecture.public_id = result.public_id;
                    lectureData.lecture.secure_url = result.secure_url;
                }

                fs.rm(`uploads/${req.file.filename}`)
            } catch (error) {
                return next(
                    new AppError(error || 'Thumbnail not uploaded, please try again ', 500)
                )
            }
        }

        course.lectures.push(lectureData);

        course.numbersOfLectures = course.lectures.length();

        await course.save();

        res.status(200).json({
            success: true,
            message: 'Lectures successfully uploaded to the courses !',
            course
        })
    } catch (error) {
        return next(
            new AppError(error.message, 500)
        )
    }

}