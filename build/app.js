"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("./utils/logger"));
const middleware_1 = require("./utils/middleware");
const morgan_1 = __importDefault(require("morgan"));
const gameStats_1 = __importDefault(require("./controllers/gameStats"));
const config_1 = require("./utils/config");
const helmet_1 = __importDefault(require("helmet"));
const app = (0, express_1.default)();
mongoose_1.default.set("strictQuery", false);
// Create URL
const url = process.env.NODE_ENV === "test"
    ? config_1.MONGODB_URI_TEST
    : config_1.MONGODB_URI;
if (!url) {
    throw new Error("MONGODB_URI is not defined");
}
const parsed = new URL(url);
parsed.password = "*****";
// Connect using IPv4
logger_1.default.info("connecting to ", parsed.toString());
mongoose_1.default.connect(url, { family: 4 })
    .then(() => logger_1.default.info(`connected to MongoDB ${url}`))
    .catch((error) => logger_1.default.error("error connecting to MongoDB: ", error.message));
// Middleware
app.use((0, helmet_1.default)()); // Security headers
app.use(express_1.default.static("dist")); // serve static content from "dist" folder, that has FE
app.use(express_1.default.json()); // parses incoming requests with a JSON body
app.use(middleware_1.requestLogger);
app.use((0, morgan_1.default)("tiny")); // logging network traffic
app.use("/api", gameStats_1.default);
app.use(middleware_1.unknownEndpoint);
app.use(middleware_1.errorHandler);
exports.default = app;
