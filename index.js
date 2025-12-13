require("dotenv").config(); // import environment values from .env
const express = require("express");
const morgan = require("morgan"); // logging network traffic
const app = express();
const GameHistory = require("./models/gameHistory");
const { aggregateTotalStats, defaultTotalStats } = require("./services/totalStats");

app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("dist")); // serve static content from "dist" folder, that has FE

// Routes
app.get("/", (request, response) => {
  response.send("<h1>Hello world</h1>");
});

app.get("/api/gamehistory", (request, response) => {
  console.log("/api/gamehistory triggered!");
  GameHistory
    .find({})
    .then(gameHistory => {
      console.log("gamehistory triggered!");
      response.json(gameHistory);
    })
});

app.get("/api/totalstats", (request, response) => {
    const result = aggregateTotalStats();
    
    result
      .then(totalStats => {
        console.log("/api/totalstats aggregate: ", totalStats[0]);
        response.json(totalStats[0] || defaultTotalStats);
      })
      .catch (error => {
        console.error("totalStats aggregation error:", error);
        response.status(500).json({ error: "Failed to compute totalStats" });
    })
});

app.post("/api/gamehistory", (request, response) => {
  const gameResult = request.body;
  console.log("request.body: ", gameResult);

  if (!gameResult.status) {
    return response.status(400).json({ error: "status missing" });
  }

  const newGameHistory = new GameHistory(gameResult);

  newGameHistory
    .save()
    .then(savedGameHistory => {
      response.json(savedGameHistory);
    })
    .catch(error => {
       console.error("Error saving game history:", error);
       response.status(500).json({error: "Failed to save game history"});
    });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});