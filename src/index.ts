import dotenv from "dotenv";
dotenv.config(); // import environment values from .env
import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
const app = express();

import { aggregateTotalStats, defaultTotalStats } from "./services/totalStats";
import { GameHistoryModel } from "./models/gameHistory";
import { GameHistory } from "./types/gameHistory";
import { HydratedDocument } from "mongoose";

// Middleware
const requestLogger = (request: Request, response: Response, next: NextFunction) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.use(express.static("dist")); // serve static content from "dist" folder, that has FE
app.use(express.json()); // parses incoming requests with a JSON body
app.use(requestLogger);
app.use(morgan("tiny")); // logging network traffic

// Routes
app.get("/", (request: Request, response: Response) => {
  response.send("<h1>Hello world</h1>");
});

app.get("/api/gamehistory", (request: Request, response: Response, next: NextFunction) => {
  //console.log("/api/gamehistory triggered!");
  GameHistoryModel
    .find({})
    .then(gameHistory => {
      //console.log("gamehistory triggered!");
      response.json(gameHistory);
    })
    .catch((error: Error) => next(error));
});

app.get("/api/totalstats", (request: Request, response: Response, next: NextFunction) => {
  const result = aggregateTotalStats();

  result
    .then(totalStats => {
      //console.log("/api/totalstats aggregate: ", totalStats[0]);
      response.json(totalStats[0] || defaultTotalStats);
    })
    .catch((error: Error) => next(error));
});

app.post("/api/gamehistory", (request: Request<{}, {}, GameHistory>, response: Response, next: NextFunction) => {
  const gameResult = request.body;
  //console.log("request.body: ", gameResult);

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

const unknownEndpoint = (request: Request, response: Response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const errorHandler = (error: Error, request: Request, response: Response, next: NextFunction) => {
  console.log(error.message);

  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  return response.status(500).json({ error: error.message });
};

app.use(errorHandler);

const PORT = process.env.PORT!;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});