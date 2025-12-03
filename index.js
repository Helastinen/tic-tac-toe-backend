const express = require("express");
const morgan = require("morgan");
const gameStats = require ("./gameStats.js");

const app = express();
app.use(express.json());
app.use(morgan("tiny"));

app.get("/", (request, response) => {
  response.send("<h1>Hello world</h1>");
});

app.get("/api/gamestats", (request, response) => {
  response.json(gameStats);
});

const generateId = () => {
  const maxId = gameStats.gameHistory.length > 0
    ? Math.max(...gameStats.gameHistory.map(g => g.id))
    : 0;
  console.log("maxId: ", maxId);
  return maxId + 1;
};

app.post("/api/gamestats", (request, response) => {
  const gameStat = request.body;
  console.log("request.body: ", gameStat);

  if (!gameStat.status) {
    return response.status(400).json({ error: "status missing" });
  }

  gameStat.id = generateId();
  console.log("gameStat with id: ", gameStat);

  gameStats.gameHistory = gameStats.gameHistory.concat(gameStat);

  response.json(gameStat);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});