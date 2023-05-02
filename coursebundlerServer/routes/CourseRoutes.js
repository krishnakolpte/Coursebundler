/** @format */

const express = require("express");
const {
    addCourseLectures,
    createCourse,
    deleteCourse,
    deleteLecture,
    getAllCourses,
    getCourseLectures,
} = require("../controllers/CourseController");
const {
    authorizeAdmin,
    isAuthenticated,
    authorizeSubscribers,
} = require("../middlewares/Auth");
const SingleFileUpload = require("../middlewares/Multer");

const router = express.Router();

//get all courses without lectures
router.route("/courses").get(getAllCourses);

//create new course -only admin
router
    .route("/createcourse")
    .post(isAuthenticated, authorizeAdmin, SingleFileUpload, createCourse);

//add lecture  -only admin
router
    .route("/course/:id")
    .get(isAuthenticated, authorizeSubscribers, getCourseLectures)
    .post(isAuthenticated, authorizeAdmin, SingleFileUpload, addCourseLectures)
    .delete(isAuthenticated, authorizeAdmin, deleteCourse);

//delete course -only admin
router.route("/lecture").delete(isAuthenticated, authorizeAdmin, deleteLecture);

module.exports = router;
