"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // import environment values from .env
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
const totalStats_1 = require("./services/totalStats");
const gameHistory_1 = require("./models/gameHistory");
// Middleware
const requestLogger = (request, response, next) => {
    console.log("Method:", request.method);
    console.log("Path:  ", request.path);
    console.log("Body:  ", request.body);
    console.log("---");
    next();
};
app.use(express_1.default.static("dist")); // serve static content from "dist" folder, that has FE
app.use(express_1.default.json()); // parses incoming requests with a JSON body
app.use(requestLogger);
app.use((0, morgan_1.default)("tiny")); // logging network traffic
// Routes
app.get("/", (request, response) => {
    response.send("<h1>Hello world</h1>");
});
app.get("/api/gamehistory", (request, response, next) => {
    //console.log("/api/gamehistory triggered!");
    gameHistory_1.GameHistoryModel
        .find({})
        .then(gameHistory => {
        //console.log("gamehistory triggered!");
        response.json(gameHistory);
    })
        .catch((error) => next(error));
});
app.get("/api/totalstats", (request, response, next) => {
    const result = (0, totalStats_1.aggregateTotalStats)();
    result
        .then(totalStats => {
        //console.log("/api/totalstats aggregate: ", totalStats[0]);
        response.json(totalStats[0] || totalStats_1.defaultTotalStats);
    })
        .catch((error) => next(error));
});
app.post("/api/gamehistory", (request, response, next) => {
    const gameResult = request.body;
    //console.log("request.body: ", gameResult);
    if (!gameResult.status) {
        return response.status(400).json({ error: "status missing" });
    }
    const newGameHistory = new gameHistory_1.GameHistoryModel(gameResult);
    newGameHistory
        .save()
        .then((savedGameHistory) => {
        response.json(savedGameHistory);
    })
        .catch((error) => next(error));
});
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);
const errorHandler = (error, request, response, next) => {
    console.log(error.message);
    if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    }
    return response.status(500).json({ error: error.message });
};
app.use(errorHandler);
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
