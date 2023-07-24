/** @format */

const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        const { connection } = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDb connected with ${connection.host}`);
    } catch (e) {
        console.log(e);
    }
};

module.exports = { connectDb };
