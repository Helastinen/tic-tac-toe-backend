"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gameHistory_1 = __importDefault(require("../models/gameHistory"));
const totalStats_1 = require("../services/totalStats");
const gameStatsRouter = express_1.default.Router();
gameStatsRouter.get("/", (request, response) => {
    response.send("<h1>Hello world</h1>");
});
gameStatsRouter.get("/gamehistory", (request, response, next) => {
    //console.log("/api/gamehistory triggered!");
    gameHistory_1.default
        .find({})
        .then(gameHistory => response.json(gameHistory))
        .catch((error) => next(error));
});
gameStatsRouter.get("/totalstats", (request, response, next) => {
    const result = (0, totalStats_1.aggregateTotalStats)();
    result
        .then(totalStats => {
        //console.log("/api/totalstats aggregate: ", totalStats[0]);
        response.json(totalStats[0] || totalStats_1.defaultTotalStats);
    })
        .catch((error) => next(error));
});
gameStatsRouter.post("/gamehistory", (request, response, next) => {
    const gameResult = request.body;
    //console.log("request.body: ", gameResult);
    if (!gameResult.status) {
        return response.status(400).json({ error: "status missing" });
    }
    const newGameHistory = new gameHistory_1.default(gameResult);
    newGameHistory
        .save()
        .then((savedGameHistory) => {
        response.json(savedGameHistory);
    })
        .catch((error) => next(error));
});
exports.default = gameStatsRouter;
