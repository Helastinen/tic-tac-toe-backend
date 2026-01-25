import express, { Request, Response, NextFunction } from "express";
import { HydratedDocument } from "mongoose";

import GameHistoryModel from "../models/gameHistory.js";
import { GameHistory } from "../types/gameHistory.js";
import { aggregateTotalStats, defaultTotalStats } from "../services/totalStats.js";
import { validate } from "../utils/middleware.js";
import { createGameHistorySchema } from "../validation/statsSchema.js";

const gameStatsRouter = express.Router();

gameStatsRouter.get("/", (request: Request, response: Response) => {
  response.send("<h1>Hello world</h1>");
});

gameStatsRouter.get("/gamehistory", (request: Request, response: Response, next: NextFunction) => {
  GameHistoryModel
    .find({})
    .then(gameHistory => response.json(gameHistory))
    .catch((error: Error) => next(error));
});

gameStatsRouter.get("/totalstats", (request: Request, response: Response, next: NextFunction) => {
  const result = aggregateTotalStats();

  result
    .then(totalStats => response.json(totalStats[0] || defaultTotalStats))
    .catch((error: Error) => next(error));
});

gameStatsRouter.post(
  "/gamehistory",
  validate(createGameHistorySchema),
  (request: Request<{}, {}, GameHistory>, response: Response, next: NextFunction) => {
    const newGameHistory = new GameHistoryModel(request.body);
/^[\p{L}0-9_]+$/u
    newGameHistory
      .save()
      .then((savedGameHistory: HydratedDocument<GameHistory>) => {
        response.json(savedGameHistory);
      })
      .catch((error: Error) => next(error));
  }
);

export default gameStatsRouter;