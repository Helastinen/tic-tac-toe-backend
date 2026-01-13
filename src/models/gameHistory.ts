import mongoose from "mongoose";
import { GameHistory } from "../types/gameHistory";

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

const GameHistoryModel = mongoose.model<GameHistory>(
  "GameHistory", 
  gameHistorySchema
);

export default GameHistoryModel;