/** @format */

const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        const { connection } = await mongoose.connect(
            "mongodb+srv://krishnakolapte0:7a3DGD8I9EHHpDok@cluster0.0ym7h5b.mongodb.net/coursebundler"
        );
        console.log(`MongoDb connected with ${connection.host}`);
    } catch (e) {
        console.log(e);
    }
};

module.exports = { connectDb };
