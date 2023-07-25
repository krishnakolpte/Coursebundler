/** @format */

const express = require("express");
const {
    buySubscription,
    cancelSubscription,
    getRazorpayKey,
    paymentVerification,
} = require("../controllers/PaymentController");
const { isAuthenticated } = require("../middlewares/Auth");

const router = express.Router();

//BUY subscription
router.route("/subscribe").get(buySubscription);
//razor Pay key
router.route("/razorpaykey").get(getRazorpayKey);
//verify payment and save database
router.route("/paymentverification").post(isAuthenticated, paymentVerification);
//cancel subscription
router.route("/subscribe/cancel").delete(isAuthenticated, cancelSubscription);

module.exports = router;
