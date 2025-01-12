import User from "../models/user.models.js"
import AppError from "../utils/error.utils.js"
import cloudinary from "cloudinary"
import fs from "fs/promises"
import sendEmail from "../utils/sendEmail.js"
import crypto from 'crypto'


const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
    httpOnly: true,
    secure: true
}

export const register = async (req, res, next) => {
    try {
        const { fullName, email, password } = req.body

        if (!fullName || !email || !password) {
            return next(new AppError('All fields are required', 400))
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return next(new AppError('User already exists', 400))
        }

        const user = await User.create({
            fullName,
            email,
            password,
            avatar: {
                public_id: email,
                secure_url: ''
            }
        });

        if (!user) {
            return next(new AppError('User Registration failed,please try again later', 400))
        }

        //File upload

        // console.log("File details", JSON.stringify(req.file));
        if (req.file) {
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: 'lms',
                    width: 250,
                    height: 250,
                    gravity: 'faces',
                    crop: 'fill'
                });

                if (result) {
                    user.avatar.public_id = result.public_id;
                    user.avatar.secure_url = result.secure_url;

                    //REmove file from server
                    fs.rm(`uploads/${req.file.filename}`)
                }
            } catch (error) {
                return next(
                    new AppError(error || 'File not uploaded, please try again ', 500)
                )
            }
        }

        await user.save();

        user.password = undefined;

        const token = await user.generateJWTToken();

        res.cookie('token', token, cookieOptions)

        res.status(201).json({
            success: true,
            message: 'User Register successfully',
            user
        })
    } catch (error) {
        return next(new AppError(error.message, 500))
    }


}

export const login = async (req, res,next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError('All fields are required', 400))
        }

        const user = await User.findOne({
            email
        }).select('+password')

        if (!user || !user.comparePassword(password)) {
            return next(new AppError('Email or password not matched', 400))
        }

        const token = await user.generateJWTToken();
        user.password = undefined;

        res.cookie('token', token, cookieOptions);

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            user
        })
    } catch (error) {
        return next(new AppError(error.message, 500))
    }

}

export const logout = (req, res) => {
    res.cookie('token', null, {
        secure: true,
        maxAge: 0,
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'User Logged out successfully'
    })
}

export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId);

        res.status(200).json({
            success: true,
            message: 'User Detail ',
            user
        })
    } catch (error) {
        return next(new AppError('Failed to fetch user details', 404));
    }


}

export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new AppError('Email is required ', 400));
    }

    const user = await User.findOne({ email });
    if (!user) {
        return next(new AppError('Email not found ', 400));
    }

    const resetToken = await user.generatePasswordResetToken();

    await user.save();

    const resetPasswordURL = `${process.env.FRONTEND_URI || 'http://localhost:3000'}/reset-password/${resetToken}`;

    console.log(resetPasswordURL);

    const subject = "Reset Password"
    const message = `You can reset your password by clicking <a href=${resetPasswordURL} target="_blank">Reset Your Password</a>\n If the above link does not work for some reason then copy paste this link in new tab ${resetPasswordURL}.\n If you have not requested this, kindly ignore it. `

    try {
        await sendEmail(email, subject, message);

        res.status(200).json({
            success: true,
            message: `Reset Password token has been sent to ${email} successfully`
        })
    }
    catch (e) {
        console.log("email sending error ", e.message);

        user.forgotPasswordExpiry = undefined;
        user.forgotPasswordToken = undefined;

        await user.save();
        return next(new AppError(e.message, 500))
    }
}

export const resetPassword = async (req, res) => {
    const { resetToken } = req.params;

    const { password } = req.body;

    const forgotPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    const user = await User.findOne({
        forgotPasswordToken,
        forgotPasswordExpiry: { $gt: Date.now() }
    });

    if (!user) {
        return next(
            new AppError('Token is invalid or Expired, Please try agian', 400)
        )
    }

    user.password = password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    user.save();

    res.status(200).json({
        success: true,
        message: 'Password changed successfully'
    })
}

export const ChangePassword = async (req, res,next) => {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.user;

    if (!oldPassword || !newPassword) {
        return next(new AppError('All fields are mandatory', 400))
    }

    const user = await User.findOne({_id:id}).select('+password');

    if (!user) {
        return next(
            new AppError("User does not exist ", 400)
        )
    }

    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
        return next(
            new AppError("Invalid old password", 400)
        )
    }

    user.password = newPassword;

    await user.save();

    user.password = undefined;

    res.status(200).json({
        success: true,
        message: 'Password changed successfully!'
    })
}

export const updateUser = async (req, res,next) => {
    const { fullName } = req.body;
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
        return next(
            new AppError('User does not exist', 400)
        )
    }

    if (req.fullName) {
        user.fullName = fullName;
    }

    if (req.file) {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id)
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'lms',
                width: 250,
                height: 250,
                gravity: 'faces',
                crop: 'fill'
            });

            if (result) {
                user.avatar.public_id = result.public_id;
                user.avatar.secure_url = result.secure_url;

                //Remove file from server
                fs.rm(`uploads/${req.file.filename}`)
            }
        } catch (error) {
            return next(
                new AppError(error || 'File not uploaded, please try again ', 400)
            )
        }
    }

    await user.save();

    res.status(200).json({
        sucess: true,
        message: "User Details updated successfully !"
    });
}