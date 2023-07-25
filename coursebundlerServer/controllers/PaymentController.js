/** @format */

const { CatchAsyncError } = require("../middlewares/CatchAsyncErrors");
const User = require("../models/UserModel");
const ErrorHandler = require("../util/ErroeHandler");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/PaymentModal");
const { log } = require("console");

const buySubscription = CatchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY,
        key_secret: process.env.RAZORPAY_SECRATE_KEY,
    });

    if (user.role === "admin")
        return next(new ErrorHandler("Admin Cant buy subscription", 404));

    const plan_id = process.env.PLAN_ID || "plan_Lhi8myd6sA0pG8";

    const subscription = await instance.subscriptions.create({
        plan_id,
        customer_notify: 1,
        total_count: 12,
    });

    user.subscription.id = subscription.id;
    user.subscription.status = subscription.status;

    await user.save();

    res.status(201).json({
        success: true,
        subscriptionId: subscription.id,
    });
});

const paymentVerification = CatchAsyncError(async (req, res, next) => {
    const {
        razorpay_signature,
        razorpay_payment_id,
        razorpay_subscription_id,
    } = req.body;

    const user = await User.findById(req.user._id);

    const subscription_id = user.subscription.id;

    const generated_signature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRATE_KEY)
        .update(razorpay_payment_id + "|" + subscription_id, "utf-8")
        .digest("hex");

    const isAuthentic = generated_signature === razorpay_signature;

    if (!isAuthentic)
        return res.redirect(`${process.env.FRONTEND_URL}/paymentfail`);

    // database comes here
    await Payment.create({
        razorpay_signature,
        razorpay_payment_id,
        razorpay_subscription_id,
    });

    user.subscription.status = "active";

    await user.save();

    res.redirect(
        `${process.env.FRONTEND_URL}/paymentsuccess?reference=${razorpay_payment_id}`
    );
});

const getRazorpayKey = CatchAsyncError(async (req, res, next) => {
    res.status(201).json({
        success: true,
        key: process.env.RAZORPAY_KEY,
    });
});

const cancelSubscription = CatchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    const subscriptionId = user.subscription.id;

    let refund = false;

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

    res.status(201).json({
        success: true,
        message: refund
            ? "Subscription Cancelled, You will recive full refund within 7 days."
            : "Subscription Cancelled, No refund initiated as subscription was cancelled after 7 days.",
    });
});

module.exports = {
    buySubscription,
    cancelSubscription,
    getRazorpayKey,
    paymentVerification,
};
