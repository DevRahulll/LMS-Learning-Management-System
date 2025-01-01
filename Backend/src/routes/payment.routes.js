import express from 'express'
import { allPayment, buySubscription, cancelSubscription, getRazorPayApiKey, verifySubscription } from '../controllers/payment.controllers.js';
import { authorizedRoles, isLoggedIn } from '../middlewares/auth.middleware.js';

const paymentRouter = express.Router();

paymentRouter.route('/razorpay-key').get(isLoggedIn, getRazorPayApiKey);
paymentRouter.route('/subscribe').post(isLoggedIn, buySubscription)
paymentRouter.route('/verify').post(isLoggedIn, verifySubscription)
paymentRouter.route('/unsubscribe').post(isLoggedIn, cancelSubscription)
paymentRouter.route('/payments').get(isLoggedIn, authorizedRoles('ADMIN'), allPayment)

export default paymentRouter;