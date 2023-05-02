/** @format */

const { CatchAsyncError } = require("../middlewares/CatchAsyncErrors");
const Course = require("../models/CourseModel");
const { getDataUri } = require("../util/DataUri");
const ErrorHandler = require("../util/ErroeHandler");
const cloudinary = require("cloudinary");
const Stats = require("../models/StatsModal");

//get all courses without lectures
const getAllCourses = CatchAsyncError(async (req, res, next) => {
    const keyword = req.query.keyword || "";
    const category = req.query.category || "";

    const courses = await Course.find({
        title: {
            $regex: keyword,
            $options: "i",
        },
        category: {
            $regex: category,
            $options: "i",
        },
    }).select("-lectures");
    res.status(200).json({
        success: true,
        courses,
    });
});

//create course -only admin
const createCourse = CatchAsyncError(async (req, res, next) => {
    const { title, description, category, createdBy } = req.body;

    if (!title || !description || !category || !createdBy)
        return next(new ErrorHandler("Please add all fields", 400));

    const file = req.file;

    const fileUri = getDataUri(file);

    const mycloude = await cloudinary.v2.uploader.upload(fileUri.content);

    await Course.create({
        title,
        description,
        category,
        createdBy,
        poster: {
            public_id: mycloude.public_id,
            url: mycloude.secure_url,
        },
    });

    res.status(201).json({
        success: true,
        message: "Course created successfully. you can add lectures now",
    });
});

//get  course lectures
const getCourseLectures = CatchAsyncError(async (req, res, next) => {
    const course = await Course.findById(req.params.id);

    if (!course) return next(new ErrorHandler("Course not found", 404));

    course.views = course.views + 1;

    await course.save();

    res.status(200).json({
        success: true,
        lectures: course.lectures,
    });
});

// max video size is 100mb
const addCourseLectures = CatchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const { title, description } = req.body;

    const course = await Course.findById(id);

    if (!course) return next(new ErrorHandler("Course not found", 404));

    //upload file here
    const file = req.file;

    const fileUri = getDataUri(file);

    const mycloude = await cloudinary.v2.uploader.upload(fileUri.content, {
        resource_type: "video",
    });

    course.lectures.push({
        title,
        description,
        video: {
            public_id: mycloude.public_id,
            url: mycloude.secure_url,
        },
    });

    course.numOfVideos = course.lectures.length;

    await course.save();

    res.status(200).json({
        success: true,
        message: "Lecture Added in Course",
    });
});

//delete course -only admin
const deleteCourse = CatchAsyncError(async (req, res, next) => {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) return next(new ErrorHandler("Course not found", 404));

    await cloudinary.v2.uploader.destroy(course.poster.public_id);

    for (let i = 0; i < course.lectures.length; i++) {
        const singleLecture = course.lectures[i];
        await cloudinary.v2.uploader.destroy(singleLecture.video.public_id, {
            resource_type: "video",
        });
    }

    await course.deleteOne();

    res.status(200).json({
        success: true,
        message: "Course deleted successfully.",
    });
});

//delete lecture -only admin
const deleteLecture = CatchAsyncError(async (req, res, next) => {
    const { courseId, lectureId } = req.query;

    const course = await Course.findById(courseId);

    if (!course) return next(new ErrorHandler("Course not found", 404));

    const lecture = course.lectures.find((item) => {
        if (item._id.toString() === lectureId.toString()) return item;
    });

    course.lectures = course.lectures.filter((item) => {
        if (item._id.toString() !== lectureId.toString()) return item;
    });

    await cloudinary.v2.uploader.destroy(lecture.video.public_id, {
        resource_type: "video",
    });
    course.numOfVideos = course.lectures.length;
    await course.save();

    res.status(200).json({
        success: true,
        message: "lecture deleted successfully.",
    });
});

Course.watch().on("change", async () => {
    const stats = await Stats.find({}).sort({ createdAt: "desc" }).limit(1);

    const courses = await Course.find({});

    let totalViews = 0;

    for (let i = 0; i < courses.length; i++) {
        totalViews = courses[i].views + courses[i].views;
    }
    stats[0].views = totalViews;
    stats[0].createdAt = new Date(Date.now());

    await stats[0].save();
});

module.exports = {
    addCourseLectures,
    createCourse,
    deleteCourse,
    deleteLecture,
    getAllCourses,
    getCourseLectures,
};
