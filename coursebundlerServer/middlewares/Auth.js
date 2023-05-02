/** @format */

const jwt = require("jsonwebtoken");
const ErrorHandler = require("../util/ErroeHandler");
const { CatchAsyncError } = require("./CatchAsyncErrors");
const User = require("../models/UserModel");

const isAuthenticated = CatchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) return next(new ErrorHandler("Not logged In", 401));

    const decoded = jwt.verify(token, process.env.JWT_SECRATE);

    req.user = await User.findById(decoded._id);

    next();
});

const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== "admin")
        return next(
            new ErrorHandler(
                `${req.user.role} is not allowed to access this resourse`,
                403
            )
        );

    next();
};

const authorizeSubscribers = (req, res, next) => {
    if (req.user.subscription.status !== "active" && req.user.role !== "admin")
        return next(
            new ErrorHandler(`Only Subscribers can access this resourse`, 403)
        );

    next();
};

module.exports = {
    isAuthenticated,
    authorizeAdmin,
    authorizeSubscribers,
};
