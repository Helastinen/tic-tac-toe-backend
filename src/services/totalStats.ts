import GameHistoryModel from "../models/gameHistory";
import { TotalStats } from "../types/totalStats";

export const defaultTotalStats: TotalStats = {
  playerOneWins: 0,
  playerTwoWins: 0,
  ties: 0,
  aborted: 0
};

export const aggregateTotalStats = async (): Promise<TotalStats[]> => {
  return GameHistoryModel.aggregate<TotalStats>([
    {
      $group: {
        _id: null,
        playerOneWins: {
          $sum: {
            $cond: [
              { $eq: ["$winnerName", "$playerOne" ] },
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
        _id: 0,
        playerOneWins: 1,
        playerTwoWins: 1,
        ties: 1,
        aborted: 1
      }
    }
  ]);
};