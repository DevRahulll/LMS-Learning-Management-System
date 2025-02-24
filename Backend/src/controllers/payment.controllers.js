import { razorpay } from "../index.js";
import Payment from "../models/payment.model.js";
import User from "../models/user.models.js";
import AppError from "../utils/error.utils.js";
import crypto from 'crypto'


export const getRazorPayApiKey = async (_req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            message: 'RazorPay API Key',
            key: process.env.RAZORPAY_KEY_ID

        })
    } catch (error) {
        return next(
            new AppError(error.message, 500)
        )
    }
}
export const buySubscription = async (req, res, next) => {
    try {
        const { id } = req.user;
        const user = await User.findById(id);
        if (!user) {
            return next(
                new AppError('Unauthorized , please Login!!', 401)
            )
        }

        if (user.role === 'ADMIN') {
            return next(
                new AppError('Admin cannot purchased a subscription ', 400)
            )
        }
        const planId = process.env.RAZORPAY_PLAN_ID;
        if (!planId) {
            return next(
                new AppError('Razorpay plan id is not configured ', 500)
            )
        }
        const subscription = await razorpay.subscriptions.create({
            plan_id: planId,
            customer_notify: 1, // 1 means razorpay will handle notifying the customer, 0 means we will not notify the customer
            total_count: 12,// 12 means it will charge every month for a 1-year sub.
        });

        user.subscription.id = subscription.id;
        user.subscription.status = subscription.status;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Subscribed sucessfully!!",
            subscription_id: subscription.id
        })
    } catch (error) {
        return next(
            new AppError(error.message, 500)
        )
    }
}
export const verifySubscription = async (req, res, next) => {
    try {

        
        const { id } = req.user;
        const { razorpay_payment_id, razorpay_signature, razorpay_subscription_id } = req.body;

        if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
            
            return res.status(401).json({
                success: false,
                message: "Invalid payment details|| all fields are mandatory"
            });
        }

        
        const user = await User.findById(id);
        if (!user) {
            return next(
                new AppError('Unauthorized , please Login !', 401)
            )
        }

        
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_SECRET)
            .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
            .digest('hex')

        
        if (generatedSignature !== razorpay_signature) {
            if (generatedSignature !== razorpay_signature) {
                
                return next(
                    new AppError('Payment not verified , please try again later', 400)
                )
            }
        }
        
        await Payment.create({
            razorpay_payment_id,
            razorpay_signature,
            razorpay_subscription_id
        });
        
        user.subscription.id = razorpay_subscription_id;
        user.subscription.status = 'active';
        await user.save();

        const response = {
            success: true,
            message: 'Payment verified successfully'
        }
        
        return res.status(200).json(response)

    } catch (error) {
        console.log("error in verification ", error);
        return next(
            new AppError(error.message, 500)
        )
    }


}


export const cancelSubscription = async (req, res, next) => {
    try {
        const { id } = req.user;

        const user = await User.findById(id)

        if (!user) {
            return next(
                new AppError("Invalid user id", 500)
            )
        }

        if (user.role === 'ADMIN') {
            return next(
                new AppError('Admin cannot cancel a subscription ', 400)
            )
        }

        const subscriptionId = user.subscription.id;

        const subscription = await razorpay.subscriptions.cancel(subscriptionId)

        user.subscription.status = subscription.status;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Subscription cnaceled successfully!"
        })

    } catch (error) {
        return next(
            new AppError(error.message, 500)
        )
    }
}

export const allPayment = async (req, res, next) => {
    try {
        const count = req.query.count ? parseInt(req.query.count, 10) : 10;
        const skip = req.query.skip ? parseInt(req.query.skip, 10) : 0;

        const allPayments = await razorpay.subscriptions.all({
            count: count ? count : 10,
            skip: skip ? skip : 0,
        });

        // console.log("Razorpay Api response : ",allPayments); // debug

        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',
        ];

        const finalMonths = {
            January: 0,
            February: 0,
            March: 0,
            April: 0,
            May: 0,
            June: 0,
            July: 0,
            August: 0,
            September: 0,
            October: 0,
            November: 0,
            December: 0,
        };

        const monthlyWisePayments = allPayments.items.map((payment) => {
            const monthsInNumbers = new Date(payment.start_at * 1000);

            return monthNames[monthsInNumbers.getMonth()];
        })

        monthlyWisePayments.map((month) => {
            Object.keys(finalMonths).forEach((objMonth) => {
                if (month === objMonth) {
                    finalMonths[month] += 1;
                }
            });
        });

        const monthlySalesRecord = Object.values(finalMonths);

        res.status(200).json({
            success: true,
            message: 'All payments are',
            allPayments,
            finalMonths,
            monthlySalesRecord
        })
    } catch (error) {
        console.log("Error in allPayments ",error);
        return next(
            new AppError(error.message, 500)
        )
    }

}