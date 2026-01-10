import mongoose from "mongoose";
import { GameHistory } from "../types/gameHistory";

mongoose.set("strictQuery", false);

const url = process.env.NODE_ENV === "test"
  ? process.env.MONGODB_TEST_URI
  : process.env.MONGODB_URI;
  
if (!url) { throw new Error("MONGODB_URI is not defined"); }

const parsed = new URL(url);
parsed.password = "*****";

// connection uses IPv4
console.log("connecting to", parsed.toString());

mongoose.connect(url, { family: 4 })
  .then(() => console.log(`connected to MongoDB ${url}`))
  .catch((error: Error) => console.log("error connecting to MongoDB: ", error.message));

// GameHistory schema
const gameHistorySchema = new mongoose.Schema<GameHistory>({
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

export const GameHistoryModel = mongoose.model<GameHistory>(
  "GameHistory", 
  gameHistorySchema
);