/** @format */

const { CatchAsyncError } = require("../middlewares/CatchAsyncErrors");
const User = require("../models/UserModel");
const Course = require("../models/CourseModel");
const ErrorHandler = require("../util/ErroeHandler");
const { sendEmail } = require("../util/SendEmail");
const { sendToken } = require("../util/SendToken");
const crypto = require("crypto");
const { getDataUri } = require("../util/DataUri");
const cloudinary = require("cloudinary");
const Stats = require("../models/StatsModal");
const Payment = require("../models/PaymentModal");
const Razorpay = require("razorpay");

const register = CatchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;

    const file = req.file;

    if (!name || !email || !password || !file)
        return next(new ErrorHandler("Please enter the All fields", 400));

    let user = await User.findOne({ email });

    if (user) return next(new ErrorHandler("User already exist", 409));

    const fileUri = getDataUri(file);

    const mycloude = await cloudinary.v2.uploader.upload(fileUri.content);

    user = await User.create({
        name,
        email,
        password,
        avatar: { public_id: mycloude.public_id, url: mycloude.secure_url },
    });

    sendToken(res, user, "Registered Successfully", 201);
});

//login user
const login = CatchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password)
        return next(new ErrorHandler("Please enter the All fields", 400));

    const user = await User.findOne({ email }).select("+password");

    if (!user) return next(new ErrorHandler("User doesen't exist", 401));

    const isMathch = await user.comparePassword(password);

    if (!isMathch)
        return next(new ErrorHandler("Incorrect Email or password", 401));

    sendToken(res, user, `Welcome back, ${user.name}`, 200);
});

//logout user
const logout = CatchAsyncError((req, res, next) => {
    res.status(200)
        .cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })
        .json({
            success: "true",
            message: "Logged out successfully",
        });
});

//get my profile
const getMyProfile = CatchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    res.status(200).json({
        success: "true",
        user,
    });
});

//delete my profile
const deleteMyProfile = CatchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    let refund = false;

    if (user.subscription.status === "active") {
        const subscriptionId = user.subscription.id;

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY,
            key_secret: process.env.RAZORPAY_SECRATE_KEY,
        });

        await instance.subscriptions.cancel(subscriptionId);

        const payment = await Payment.findOne({
            razorpay_subscription_id: subscriptionId,
        });

        const gap = Date.now() - payment.createdAt;

        const refundTime = process.env.REFUND_DAYS * 24 * 60 * 60 * 1000;

        if (refundTime > gap) {
            await instance.payments.refund(payment.razorpay_payment_id);
            refund = true;
        }

        await Payment.deleteOne();
        user.subscription.id = undefined;
        user.subscription.status = undefined;
        await user.save();
    }
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    await user.deleteOne();

    res.status(200)
        .cookie("token", null, {
            expires: new Date(Date.now()),
        })
        .json({
            success: "true",
            message: refund
                ? "Subscription Cancelled, You will recive full refund within 7 days.Account deleted successfully"
                : "Subscription Cancelled, No refund initiated as subscription was cancelled after 7 days.Account deleted successfully",
        });
});

//change password
const changePassword = CatchAsyncError(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword)
        return next(new ErrorHandler("Please enter the All fields", 400));

    const user = await User.findById(req.user._id).select("+password");

    const isMathch = await user.comparePassword(oldPassword);

    if (!isMathch) return next(new ErrorHandler("Incorrect Old password", 400));

    user.password = newPassword;

    await user.save();

    res.status(200).json({
        success: "true",
        message: "Password chaneged successfuly",
    });
});

//get update profile
const updateProfile = CatchAsyncError(async (req, res, next) => {
    const { name, email } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.status(200).json({
        success: "true",
        message: "Profile updated successfuly",
    });
});

//get update profile picture
const updateProfilePicture = CatchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    const file = req.file;

    if (!file) return next(new ErrorHandler("Please choose file", 400));

    const fileUri = getDataUri(file);

    const mycloude = await cloudinary.v2.uploader.upload(fileUri.content);

    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    user.avatar = {
        public_id: mycloude.public_id,
        url: mycloude.secure_url,
    };

    await user.save();

    res.status(200).json({
        success: "true",
        message: "Profile picture updated successfuly",
    });
});

//get forget password
const forgetPassword = CatchAsyncError(async (req, res, next) => {
    const { email } = req.body;

    if (!email) return next(new ErrorHandler("Enter all fields", 400));

    const user = await User.findOne({ email });

    if (!user) return next(new ErrorHandler("User not found", 400));

    const resetToken = await user.getResetToken();

    await user.save();

    //send token via email
    const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
    const message = `Click on the link to reset your password. ${url}. If you have not requested then please ignore.`;
    await sendEmail(user.email, "Coursebundler Reset password", message);

    res.status(200).json({
        success: "true",
        message: `Reset token has been send to ${user.email}`,
    });
});

//get reset password
const resetPassword = CatchAsyncError(async (req, res, next) => {
    const { token } = req.params;

    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordTokenExpire: {
            $gt: Date.now(),
        },
    });

    if (!user)
        return next(
            new ErrorHandler("Token is invalid or has been expired", 400)
        );

    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;

    user.save();

    res.status(200).json({
        success: "true",
        message: "Password change successfuly",
    });
});

const addtoPlaylist = CatchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    const course = await Course.findById(req.body.id);

    if (!course) return next(new ErrorHandler("Invalid Course Id", 400));
    const itemExist = user.playlist.find((item) => {
        if (item.course.toString() === course._id.toString()) return true;
    });
    if (itemExist) return next(new ErrorHandler("Item already exist", 409));

    user.playlist.push({
        course: course._id,
        poster: course.poster.url,
    });

    await user.save();

    res.status(200).json({
        success: "true",
        message: "added to playlist",
    });
});

const removeFromPlaylist = CatchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    const course = await Course.findById(req.query.id);

    if (!course) return next(new ErrorHandler("Invalid Course Id", 400));

    const newPlaylist = user.playlist.filter((item) => {
        if (item.course.toString() !== course._id.toString()) return item;
    });

    user.playlist = newPlaylist;
    await user.save();

    res.status(200).json({
        success: "true",
        message: "Removed from the playlist",
    });
});

//get all users
const getAllUsers = CatchAsyncError(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: "true",
        users,
    });
});

//change user role
const updateUserRole = CatchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) return next(new ErrorHandler("user not found", 404));

    if (user.role === "user") user.role = "admin";
    else user.role = "user";

    await user.save();

    res.status(200).json({
        success: "true",
        message: "Role Updated successfully",
    });
});

//delete user
const deleteUser = CatchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) return next(new ErrorHandler("user not found", 404));

    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    await user.deleteOne();

    res.status(200).json({
        success: "true",
        message: "User deleted successfully",
    });
});

User.watch().on("change", async () => {
    const stats = await Stats.find({}).sort({ createdAt: "desc" }).limit(1);
    const subscription = await User.find({ "subscription.status": "active" });
    stats[0].users = await User.countDocuments();
    stats[0].subscriptions = subscription.length;
    stats[0].createdAt = new Date(Date.now());

    await stats[0].save();
});

module.exports = {
    addtoPlaylist,
    changePassword,
    deleteMyProfile,
    deleteUser,
    forgetPassword,
    getAllUsers,
    getMyProfile,
    login,
    logout,
    register,
    removeFromPlaylist,
    resetPassword,
    updateProfile,
    updateProfilePicture,
    updateUserRole,
};
