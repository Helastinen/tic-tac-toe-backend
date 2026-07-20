import GameHistoryModel from "../models/gameHistory";
import { TotalStats } from "../types/totalStats";

export const defaultTotalStats: TotalStats = {
  allGames: {
    totalGames: 0,
    wins: 0,
    ties: 0,
    aborted: 0
  },
  soloGames: {
    totalSoloGames: 0,
    humanWins: 0,
    computerWins: 0,
    ties: 0,
    aborted: 0,
  },
  twoPlayerGames: {
    totalTwoPlayerGames: 0,
    playerOneWins: 0,
    playerTwoWins: 0,
    ties: 0,
    aborted: 0,
  }
};

export const aggregateTotalStats = async (): Promise<TotalStats> => {
  const result = await GameHistoryModel.aggregate<TotalStats>([
    { 
      $facet: {
        allGames: allGamesPipeline,
        soloGames: soloGamesPipeline,
        twoPlayerGames: twoPlayerPipeline
      }
    },
    {
      // flatten the array that $facet returns
      $project: {
        allGames: { $arrayElemAt: ["$allGames", 0] },
        soloGames: { $arrayElemAt: ["$soloGames", 0] },
        twoPlayerGames: { $arrayElemAt: ["$twoPlayerGames", 0] },
      }
    }
  ]);
  console.log("aggregateTotalStats result", result);

  const stats = result[0];

  // safe return, if stats do not exist
  return {
    allGames: stats.allGames ?? defaultTotalStats.allGames,
    soloGames: stats.soloGames ?? defaultTotalStats.soloGames,
    twoPlayerGames: stats.twoPlayerGames ?? defaultTotalStats.twoPlayerGames,
  }
};

//** Aggregation Pipelines */
// Aggregates global stats across every game
const allGamesPipeline = [
  {
    $group: {
      _id: null,
      totalGames: { $sum: 1 },
      wins: {
        $sum: {
          $cond: [
            {
              $or: [
                { $eq: ["$winnerName", "$playerOne" ] },
                { $eq: ["$winnerName", "$playerTwo"] },
                { $eq: ["$computerWon", true] },
              ]
            },
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
    $project: { _id: 0 }
  }
];

// Aggregates stats for solo games only. human player always plays as playerOne
const soloGamesPipeline = [
  { $match: {isSinglePlayerGame: true }},
  {
    $group: {
      _id: null,
      totalSoloGames: {$sum: 1 },
      humanWins: {
        $sum: {
          $cond: [
            { $eq: ["$winnerName", "$playerOne" ] },
            1,
            0
          ]
        }
      },
      computerWins: {
        $sum: {
          $cond: [
            { $eq: ["$computerWon", true] },
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
    $project: { _id: 0 }
  }
];

// Aggregates stats for two‑player games only
const twoPlayerPipeline = [
  { $match: {isSinglePlayerGame: false }},
  {
    $group: {
      _id: null,
      totalTwoPlayerGames: {$sum: 1 },
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
    $project: { _id: 0 }
  }
];