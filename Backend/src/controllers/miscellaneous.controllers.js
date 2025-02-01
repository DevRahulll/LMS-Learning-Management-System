import User from "../models/user.models.js";
import AppError from "../utils/error.utils.js";
import sendEmail from "../utils/sendEmail.js";
import { config } from 'dotenv'

config();


export const contactUs = async (req, res, next) => {

    const { email, name, message } = req.body;

    if (!email || !name || !message) {
        return next(
            new AppError('Name,Email, Message are required')
        );
    }

    try {
        const subject = 'Contact Us Form';
        const textMessage = `${name} - ${email} <br/> ${message}`;

        await sendEmail(process.env.CONTACT_US_EMAIL, subject, textMessage);

    } catch (error) {
        console.error("Error in contactus:",error)
        return next(
            new AppError("Error in sending contact us email ", error.message, 400)
        )
    }

    res.status(200).json({
        success: true,
        message: "Your request has been submitted successfully"
    })
}


// Admin only
export const userStats = async (req, res, next) => {

    if(!req.user||req.user.role!=='ADMIN'){
        return next(
            new AppError("Access Denied! Admins only. ",403)
        )
    }

    const allUseraccount = await User.countDocuments();

    const subscribedUsersCount = await User.countDocuments({
        'subscription.status': 'active',
    });

    // console.log(allUseraccount, subscribedUsersCount);
    
    res.status(200).json({
        success: true,
        message: "All registered users count",
        allUseraccount,
        subscribedUsersCount
    });
}