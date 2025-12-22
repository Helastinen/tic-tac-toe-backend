const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.NODE_ENV === "test"
  ? process.env.MONGODB_TEST_URI
  : process.env.MONGODB_URI;

const parsed = new URL(url);

parsed.password = "*****";

// connection uses IPv4
console.log("connecting to", parsed.toString());

mongoose.connect(url, { family: 4 })
  .then(() => console.log(`connected to MongoDB ${url}`))
  .catch(error => console.log("error connecting to MongoDB: ", error.message));

// GameHistory schema
const gameHistorySchema = new mongoose.Schema({
  playerOne: { type: String, required: true, minLength: 3 },
  playerTwo: { type: String, required: true, minLength: 3 },
  winnerName: { type: String, required: false },
  winningMark: { type: String, required: false },
  winningMove: { type: Number, required: false },
  status: { type: String, required: true },
});

// remove redundant ids from response
gameHistorySchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model("GameHistory", gameHistorySchema);