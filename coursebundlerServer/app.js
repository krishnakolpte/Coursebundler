/** @format */

const Express = require("express");
const { config } = require("dotenv");
const ErrorMiddleware = require("./middlewares/Error");
const cookieParser = require("cookie-parser");
const cors = require("cors");

config({
    path: "./config/config.env",
});

const app = Express();

//using middlewares
app.use(Express.json());
app.use(
    Express.urlencoded({
        extended: true,
    })
);
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

// importing & using Routes
const course = require("./routes/CourseRoutes");
const user = require("./routes/UserRoutes");
const payment = require("./routes/PaymentRoutes");
const other = require("./routes/OtherRoutes");

app.use("/api/v1", course);
app.use("/api/v1", user);
app.use("/api/v1", payment);
app.use("/api/v1", other);

app.use(ErrorMiddleware);

module.exports = app;
