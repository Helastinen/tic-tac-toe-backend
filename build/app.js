import express from "express";
import mongoose from "mongoose";
import logger from "./utils/logger.js";
import { errorHandler, requestLogger, unknownEndpoint } from "./utils/middleware.js";
import morgan from "morgan";
import gameStatsRouter from "./controllers/gameStats.js";
import { MONGODB_URI, MONGODB_URI_TEST } from "./utils/config.js";
const app = express();
mongoose.set("strictQuery", false);
// create URL
const url = process.env.NODE_ENV === "test"
    ? MONGODB_URI_TEST
    : MONGODB_URI;
if (!url) {
    throw new Error("MONGODB_URI is not defined");
}
const parsed = new URL(url);
parsed.password = "*****";
// connect using IPv4
logger.info("connecting to ", parsed.toString());
mongoose.connect(url, { family: 4 })
    .then(() => logger.info(`connected to MongoDB ${url}`))
    .catch((error) => logger.error("error connecting to MongoDB: ", error.message));
// middleware
app.use(express.static("dist")); // serve static content from "dist" folder, that has FE
app.use(express.json()); // parses incoming requests with a JSON body
app.use(requestLogger);
app.use(morgan("tiny")); // logging network traffic
app.use("/api", gameStatsRouter);
app.use(unknownEndpoint);
app.use(errorHandler);
export default app;
