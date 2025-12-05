const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const gameStats = require ("./gameStats.js");

const app = express();
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

app.get("/", (request, response) => {
  response.send("<h1>Hello world</h1>");
});

app.get("/api/gamehistory", (request, response) => {
  response.json(gameStats.gameHistory);
});

app.get("/api/totalstats", (request, response) => {
  response.json(gameStats.totalStats);
});

const generateId = () => {
  const maxId = gameStats.gameHistory.length > 0
    ? Math.max(...gameStats.gameHistory.map(g => g.id))
    : 0;
  console.log("maxId: ", maxId);
  return maxId + 1;
};

app.post("/api/gamehistory", (request, response) => {
  const gameResult = request.body;
  console.log("request.body: ", gameResult);

  if (!gameResult.status) {
    return response.status(400).json({ error: "status missing" });
  }

  gameResult.id = generateId();
  console.log("gameResult with id: ", gameResult);

  gameStats.gameHistory = gameStats.gameHistory.concat(gameResult);

  response.json(gameResult);
});

app.put("/api/totalstats", (request, response) => {
  const updatedTotalStats = request.body;
  console.log("request.body: ", updatedTotalStats);

  gameStats.totalStats = updatedTotalStats;

  response.json(updatedTotalStats);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});