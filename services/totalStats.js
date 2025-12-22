const GameHistory = require("../models/gameHistory");

const defaultTotalStats = {
  playerOneWins: 0,
  playerTwoWins: 0,
  ties: 0,
  aborted: 0
};

const aggregateTotalStats = () => {
  return GameHistory.aggregate([
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
        playerOneWins: "$playerOneWins",
        playerTwoWins: "$playerTwoWins",
        ties: "$ties",
        aborted: "$aborted"
      }
    }
  ]);
};

module.exports = { defaultTotalStats, aggregateTotalStats };