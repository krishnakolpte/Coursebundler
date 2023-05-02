/** @format */

const multer = require("multer");

const storage = multer.memoryStorage();

const SingleFileUpload = multer({ storage }).single("file");

module.exports = SingleFileUpload;
