import AppError from "../utils/error.utils.js";
import jwt from 'jsonwebtoken'

const isLoggedIn = (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new AppError('Unauthencated, please login in', 401))
    }

    const userDetails = jwt.verify(token, process.env.JWT_SECRET);

    req.user = userDetails;
    next();
}

const authorizedRoles = (...roles) => async (req, res, next) => {
    const currentUserRoles = req.user.role;
    if (!roles.includes(currentUserRoles)) {
        return next(
            new AppError('You do not have permission to excess this route', 403)
        )
    }

    next();
}

export {
    isLoggedIn,
    authorizedRoles
}