import AppError from "../utils/error.utils.js"
import cloudinary from "cloudinary"
import fs from "fs/promises"
import Course from "../models/course.models.js"
import path from "path"


export const getAllCourses = async (_req, res, next) => {
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
    });
    if (!course) {
        return next(
            new AppError("Course could not be created,please try again", 400)
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
            // Empty the uploads directory without deleting the uploads directory
            for (const file of await fs.readdir('uploads/')) {
                await fs.unlink(path.join('uploads/', file));
            }
            return next(
                new AppError(error || 'File not uploaded, please try again ', 400)
            )
        }
    }

    await course.save();

    res.status(201).json({
        success: true,
        message: 'Course created successfully!',
        course
    });
}

export const updateCourse = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return next(
                new AppError("Id is invalid or required", 400)
            )
        }
        const course = await Course.findByIdAndUpdate(
            id,
            {
                $set: req.body // This will only update the fields which are present
            },
            {
                runValidators: true // This will run the validation checks on the new data
            }
        )
        if (!course) {
            return next(
                new AppError("course with given id does not exist", 400)
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

export const removeLectureFromCourse = async (req, res, next) => {
    try {
        const { courseId, lectureId } = req.query;

        console.log(courseId);
        if (!courseId) {
            return next(new AppError('Course ID is required', 400));
        }
        if (!lectureId) {
            return next(new AppError('lecture ID is required', 400));
        }

        const course = await Course.findById(courseId);

        if (!course) {
            return next(
                new AppError("Invalid Id or Course Doesn't exist. ", 404)
            )
        }
        // Find the index of the lecture using the lectureId
        const lectureIndex = course.lectures.findIndex(
            (lecture) => lecture._id.toString() === lectureId.toString()
        );
        // If returned index is -1 then send error as mentioned below
        if (lectureIndex === -1) {
            return next(new AppError('Lecture does not exist.', 404));
        }
        // Delete the lecture from cloudinary
        await cloudinary.v2.uploader.destroy(
            course.lectures[lectureIndex].lecture.public_id,
            {
                resource_type: 'video',
            }
        );

        // Remove the lecture from the array
        course.lectures.splice(lectureIndex, 1);

        // update the number of lectures based on lectres array length
        course.numberOfLectures = course.lectures.length;

        await course.save();

        res.status(200).json({
            success: true,
            message: 'course lecture removed successfully!',
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
                new AppError('All fields are required', 400)
            )
        }

        const course = await Course.findById(id);
        if (!course) {
            return next(
                new AppError('Course does not exist with this id', 400)
            )
        }

        let lectureData = {
            title,
            description,
            lecture: {}
        };

        if (req.file) {
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: 'lms',
                    chunk_size: 50000000, // 50 mb size
                    resource_type: 'video',
                });
                if (result) {
                    lectureData.lecture.public_id = result.public_id;
                    lectureData.lecture.secure_url = result.secure_url;
                }

                fs.rm(`uploads/${req.file.filename}`)
            } catch (error) {
                // Empty the uploads directory without deleting the uploads directory
                for (const file of await fs.readdir('uploads/')) {
                    await fs.unlink(path.join('uploads/', file));
                }
                return next(
                    new AppError(error || 'Thumbnail not uploaded, please try again ', 400)
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

export const deleteCourseById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);

        if (!course) {
            return next(new AppError("Course with given id does not exist.", 404))
        }

        await course.remove();

        res.status(200).json({
            success: true,
            message: "Course Deleted Successfully"
        });
    } catch (error) {
        return next(new AppError(error.message))
    }
}