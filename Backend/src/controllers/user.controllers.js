import User from "../models/user.models.js"
import AppError from "../utils/error.utils.js"
import cloudinary from "cloudinary"


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

        if(req.file){
            console.log(req.file);
            try {
                const result=await cloudinary.v2.uploader.upload(req.file.path,{
                    folder:'lms',
                    width:250,
                    height:250,
                    gravity:'faces',
                    crop:'fill'
                });

                if(result){
                    user.avatar.public_id=result.public_id;
                    user.avatar.secure_url=result.secure_url;

                    //REmove file from server
                    fs.rm(`uploads/${req.file.filename}`)
                }
            } catch (error) {
                return next(
                    new AppError(error|| 'File not uploaded, please try again ',500)
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
export const login = async (req, res) => {
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
            message: 'User logged In successfully',
            user
        })
    } catch (error) {
        return next(new AppError(error.message, 500))
    }

}
export const logout = (req, res) => {
    res.cookie('token',null,{
        secure:true,
        maxAge:0,
        httpOnly:true
    })

    res.status(200).json({
        success:true,
        message:'User Logged out successfully'
    })
}
export const getProfile = async (req, res) => {
    try {
        const userId=req.user.id
        const user= await User.findById(userId);

        res.status(200).json({
            success:true,
            message:'User Detail ',
            user
        })
    } catch (error) {
        return next(new AppError('Failed to fetch user details',404));
    }


}