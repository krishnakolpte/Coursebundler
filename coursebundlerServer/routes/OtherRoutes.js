/** @format */

const express = require("express");
const {
    contact,
    courseRequest,
    getDashboardStats,
} = require("../controllers/OtherController");

const { authorizeAdmin, isAuthenticated } = require("../middlewares/Auth");

const router = express.Router();

//contact
router.route("/contact").post(isAuthenticated, contact);

//request course
router.route("/courserequest").post(isAuthenticated, courseRequest);

//request course
router
    .route("/admin/stats")
    .get(isAuthenticated, authorizeAdmin, getDashboardStats);

module.exports = router;
