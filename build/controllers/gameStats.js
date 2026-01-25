import express from "express";
import GameHistoryModel from "../models/gameHistory.js";
import { aggregateTotalStats, defaultTotalStats } from "../services/totalStats.js";
import { validate } from "../utils/middleware.js";
import { createGameHistorySchema } from "../validation/statsSchema.js";
const gameStatsRouter = express.Router();
gameStatsRouter.get("/", (request, response) => {
    response.send("<h1>Hello world</h1>");
});
gameStatsRouter.get("/gamehistory", (request, response, next) => {
    GameHistoryModel
        .find({})
        .then(gameHistory => response.json(gameHistory))
        .catch((error) => next(error));
});
gameStatsRouter.get("/totalstats", (request, response, next) => {
    const result = aggregateTotalStats();
    result
        .then(totalStats => response.json(totalStats[0] || defaultTotalStats))
        .catch((error) => next(error));
});
gameStatsRouter.post("/gamehistory", validate(createGameHistorySchema), (request, response, next) => {
    const newGameHistory = new GameHistoryModel(request.body);
    /^[\p{L}0-9_]+$/u;
    newGameHistory
        .save()
        .then((savedGameHistory) => {
        response.json(savedGameHistory);
    })
        .catch((error) => next(error));
});
export default gameStatsRouter;
