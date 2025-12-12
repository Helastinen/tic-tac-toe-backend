const express = require("express");
const morgan = require("morgan");
// const gameStats = require ("./gameStats.js");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("dist"));

// MongoDB
if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const username = "hellstenantti_db_user";
const password = process.argv[2];
const dbName = "gamehistory";  
const appName = "Cluster0";
const url = `mongodb+srv://${username}:${password}@cluster0.xcbdbl1.mongodb.net/${dbName}?appName=${appName}`;

mongoose.set("strictQuery", false);

// connection uses IPv4
mongoose.connect(url, { family: 4 });

// GameHistory Mongo schema
const gameHistorySchema = new mongoose.Schema({
  id: {type: Number, required: true},
  playerOne: {type: String, required: true},
  playerTwo: {type: String, required: true},
  winnerName: {type: String, required: false},
  winningMark: {type: String, required: false},
  winningMove: {type: Number, required: false},
  status: {type: String, required: true},
});

gameHistorySchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const GameHistory = mongoose.model("GameHistory", gameHistorySchema);

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});