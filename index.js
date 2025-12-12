require("dotenv").config(); // import environment values from .env
const express = require("express");
const morgan = require("morgan"); // logging network traffic
const app = express();
const GameHistory = require("./models/gameHistory");

app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("dist")); // serve static content from "dist" folder, that has FE

// Routes
app.get("/", (request, response) => {
  response.send("<h1>Hello world</h1>");
});

app.get("/api/gamehistory", (request, response) => {
  console.log("/api/gamehistory triggered!");
  GameHistory.find({})
    .then(gameHistory => {
      console.log("gamehistory triggered!");
      response.json(gameHistory);
    })
  // response.json(gameStats.gameHistory);
});

app.get("/api/totalstats", async (request, response) => {
  try {
    const result = await GameHistory.aggregate([
      {
        $group: {
          _id: null,
          playerOneWins: {
            $sum: {
              $cond: [
                { $eq: ["$winnerName", "$playerOne" ]},
                1,
                0
              ]
            }
          },
          playerTwoWins: {
            $sum: {
              $cond: [
                { $eq: ["$winnerName", "$playerTwo"] },
                1,
                0
              ]
            }
          },
          ties: {
            $sum: {
              $cond: [
                { $eq: ["$status", "completed_with_tie"] },
                1,
                0
              ]
            }
          },
          aborted: {
            $sum: {
              $cond: [
                { $eq: ["$status", "aborted"] },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $project: {
          _id: null,
          playerOneWins: "$playerOneWins",
          playerTwoWins: "$playerTwoWins",
          ties: "$ties",
          aborted: "$aborted"
        }
      }
    ])
    console.log("/api/totalstats aggregate: ", result[0]);
    response.json(result[0] || { totalStats: {} });
  } catch (error) {
    console.error("totalStats aggregation error:", error);
    response.status(500).json({ error: "Failed to compute totalStats" });
  }
});

const generateId = () => {
  const maxId = gameStats.gameHistory.length > 0
    ? Math.max(...gameStats.gameHistory.map(g => g.id))
    : 0;
  //console.log("maxId: ", maxId);
  return maxId + 1;
};

app.post("/api/gamehistory", (request, response) => {
  const gameResult = request.body;
  console.log("request.body: ", gameResult);

  if (!gameResult.status) {
    return response.status(400).json({ error: "status missing" });
  }

  gameResult.id = generateId();
  //console.log("gameResult with id: ", gameResult);

  gameStats.gameHistory = gameStats.gameHistory.concat(gameResult);

  response.json(gameResult);
});

/* app.put("/api/totalstats", (request, response) => {
  const updatedTotalStats = request.body;
  //console.log("request.body: ", updatedTotalStats);

  gameStats.totalStats = updatedTotalStats;

  response.json(updatedTotalStats);
});*/

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});