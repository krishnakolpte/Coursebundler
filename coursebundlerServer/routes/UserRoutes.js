/** @format */

const express = require("express");
const {
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
} = require("../controllers/UserController");
const { authorizeAdmin, isAuthenticated } = require("../middlewares/Auth");
const SingleFileUpload = require("../middlewares/Multer");

const router = express.Router();

// to register a new user
router.route("/register").post(SingleFileUpload, register);

// login
router.route("/login").post(login);

//logout
router.route("/logout").get(logout);

//get my profile
router.route("/me").get(isAuthenticated, getMyProfile);

//delete my profile
router.route("/me").delete(isAuthenticated, deleteMyProfile);

//change password
router.route("/changepassword").put(isAuthenticated, changePassword);
//update profile
router.route("/updateprofile").put(isAuthenticated, updateProfile);

router
    .route("/updateprofilepicture")
    .put(isAuthenticated, SingleFileUpload, updateProfilePicture);

router.route("/forgetpassword").post(forgetPassword);

router.route("/resetpassword/:token").put(resetPassword);

router.route("/addtoplaylist").post(isAuthenticated, addtoPlaylist);
router.route("/removefromplaylist").delete(isAuthenticated, removeFromPlaylist);

// Admin Routes
router.route("/admin/users").get(isAuthenticated, authorizeAdmin, getAllUsers);

router
    .route("/admin/user/:id")
    .put(isAuthenticated, authorizeAdmin, updateUserRole)
    .delete(isAuthenticated, authorizeAdmin, deleteUser);

module.exports = router;
