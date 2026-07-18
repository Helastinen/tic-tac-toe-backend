export interface GameHistory {
  playerOne: string;
  playerTwo: string;
  winnerName?: string;
  winningMark?: string;
  winningMove?: number;
  status: string;
  isSinglePlayerGame: boolean;
  computerWon?: boolean;
  // Mongoose-added fields
  _id: ObjectId;
  __v?: number;
  // Added in toJSON transform
  id?: string;
}