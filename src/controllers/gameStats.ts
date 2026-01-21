import express, { Request, Response, NextFunction } from "express";
import { HydratedDocument } from "mongoose";

import GameHistoryModel from "../models/gameHistory";
import { GameHistory } from "../types/gameHistory";
import { aggregateTotalStats, defaultTotalStats } from "../services/totalStats";

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

gameStatsRouter.post("/gamehistory", (request: Request<{}, {}, GameHistory>, response: Response, next: NextFunction) => {
  const gameResult = request.body;

  if (!gameResult.status) {
    return response.status(400).json({ error: "status missing" });
  }

  const newGameHistory = new GameHistoryModel(gameResult);

  newGameHistory
    .save()
    .then((savedGameHistory: HydratedDocument<GameHistory>) => {
      response.json(savedGameHistory);
    })
    .catch((error: Error) => next(error));
});

export default gameStatsRouter;