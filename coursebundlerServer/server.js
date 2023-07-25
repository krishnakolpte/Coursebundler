/** @format */

const app = require("./app");
const { connectDb } = require("./config/Database");
const cloudinary = require("cloudinary");
const nodeCron = require("node-cron");
const { Stats } = require("./models/StatsModal");

connectDb();

cloudinary.v2.config({
    cloud_name: process.env.CLOUDE_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRATE,
});

nodeCron.schedule("0 0 0 1 * *", async () => {
    try {
        await Stats.create({});
    } catch (error) {
        console.log(error);
    }
});

app.get("/", (req, res) => {
    res.send(
        `<h1>Site is Working, Click <a href=${process.env.FRONTEND_URL}>Here</a> to visit Frontend</h1>`
    );
});

app.listen(process.env.PORT, () => {
    console.log(`Server is working on port: ${process.env.PORT}`);
});
