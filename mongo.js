const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const username = "hellstenantti_db_user";
const password = process.argv[2];
const dbName = "gamestats";  
const appName = "Cluster0";
const url = `mongodb+srv://${username}:${password}@cluster0.xcbdbl1.mongodb.net/${dbName}?appName=${appName}`;

mongoose.set("strictQuery", false);

// connection uses IPv4
mongoose.connect(url, { family: 4 })

const GameHistorySchema = new mongoose.Schema({
  id: {type: Number, required: true},
  playerOne: {type: String, required: true},
  playerTwo: {type: String, required: true},
  winnerName: {type: String, required: false},
  winningMark: {type: String, required: false},
  winningMove: {type: Number, required: false},
  status: {type: String, required: true},
});

const TotalStatsSchema = new mongoose.Schema({
  playerOneWins: {type: Number, required: true},
  playerTwoWins: {type: Number, required: true},
  ties: {type: Number, required: true},
  aborted: {type: Number, required: true},
});

const gameStatsSchema = new mongoose.Schema({
  gameHistory: [GameHistorySchema],
  totalStats: TotalStatsSchema,
});

const GameStats = mongoose.model("Gamestats", gameStatsSchema);

const gameStat = new GameStats({
  "gameHistory": [
    {
      "id": 1,
      "playerOne": "Alice",
      "playerTwo": "Bob",
      "winnerName": "Bob",
      "winningMark": "O",
      "winningMove": 5,
      "status": "completed_with_winner"
    },
  ],
    "totalStats": {
      "playerOneWins": 1,
      "playerTwoWins": 0,
      "ties": 0,
      "aborted": 0
    }
});

/* gameStat.save().then(result => {
  console.log("gameStat saved!");
  console.log("result: ", result);
  mongoose.connection.close();
});
*/


GameStats.find({})
  .then(result => {
    result.forEach(gameStat => console.log(gameStat));
    mongoose.connection.close();
  });