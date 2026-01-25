import mongoose from "mongoose";
import { GameHistory } from "../types/gameHistory.js";
import { allowedChars } from "../constants.js";

// GameHistory schema
const gameHistorySchema = new mongoose.Schema<GameHistory>({
  playerOne: { type: String, required: true, match: allowedChars, minLength: 3, maxLength: 20 },
  playerTwo: { type: String, required: true, match: allowedChars, minLength: 3, maxLength: 20 },
  winnerName: { type: String, required: false, match: allowedChars, minLength: 3, maxLength: 20 },
  winningMark: { type: String, required: false, enum: ["X", "O"] },
  // Game can not be won before turn 5
  winningMove: { type: Number, required: false, min: 5, max: 9 },
  status: { type: String, required: true, enum: [
    "aborted",
    "completed_with_winner",
    "completed_with_tie"
  ]},
});

// remove redundant ids from response
gameHistorySchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const GameHistoryModel = mongoose.model<GameHistory>(
  "GameHistory", 
  gameHistorySchema
);

export default GameHistoryModel;