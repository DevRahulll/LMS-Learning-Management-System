import AppError from "../utils/error.utils.js";
import jwt from 'jsonwebtoken'

const isLoggedIn = (req, _res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new AppError('Unauthencated, please login in', 401))
    }

    const userDetails = jwt.verify(token, process.env.JWT_SECRET);

    req.user = userDetails;
    next();
}

const authorizedRoles = (...roles) => async (req, _res, next) => {
    const currentUserRoles = req.user.role;
    if (!roles.includes(currentUserRoles)) {
        return next(
            new AppError('You do not have permission to excess this route', 403)
        )
    }

    next();
}

const authorizeSubscriber = async (req, _res, next) => {
    const subscription = req.user.subscription;
    const currentUserRole = req.user.role;

    if (currentUserRole !== 'ADMIN' && subscription.status !== 'active') {
        return next(
            new AppError('Please subscribe to access this route! ', 403)
        )
    }

    next();
}

export {
    isLoggedIn,
    authorizedRoles,
    authorizeSubscriber
}