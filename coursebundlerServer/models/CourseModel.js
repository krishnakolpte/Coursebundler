/** @format */

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter course title"],
        minLength: [4, "Title must be at least 4 charecters"],
        maxLength: [80, "Title can't be exceed 80 charecters"],
    },
    description: {
        type: String,
        required: [true, "Please enter course decription"],
        minLength: [20, "Title must be at least 20 charecters"],
    },
    lectures: [
        {
            title: {
                type: String,
                required: [true, "Please enter lecture title"],
            },
            description: {
                type: String,
                required: [true, "Please enter course decription"],
                minLength: [20, "Title must be at least 20 charecters"],
            },
            video: {
                public_id: {
                    type: String,
                    required: true,
                },
                url: {
                    type: String,
                    required: true,
                },
            },
        },
    ],
    poster: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    views: {
        type: Number,
        default: 0,
    },
    numOfVideos: {
        type: Number,
        default: 0,
    },
    category: {
        type: String,
        required: [true, "Please enter course category"],
    },
    createdBy: {
        type: String,
        required: [true, "Please enter course creator name"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = Course = mongoose.model("Course", schema);
