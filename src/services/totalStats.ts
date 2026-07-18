import GameHistoryModel from "../models/gameHistory";
import { TotalStats } from "../types/totalStats";

export const defaultTotalStats: TotalStats = {
  allGames: {
    totalGames: 0,
    playerOneWins: 0,
    playerTwoWins: 0,
    ties: 0,
    aborted: 0,
    singlePlayerGames: 0,
    computerWins: 0
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

  return result[0];
};

//** Aggregation Pipelines */
const allGamesPipeline = [
  {
    $group: {
      _id: null,
      totalGames: { $sum: 1 },
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
      },
      singlePlayerGames: {
        $sum: {
          $cond: [
            { $eq: ["$isSinglePlayerGame", true] },
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
      }
    }
  },
  {
    $project: { _id: 0 }
  }
];

const soloGamesPipeline = [
  { $match: {isSinglePlayerGame: true }},
  {
    $group: {
      _id: null,
      totalSoloGames: {$sum: 1 },
      // human player always plays as playerOne
      humanWins: {
        $sum: {
          $cond: [
            { $eq: ["$winnerName", "$playerOne" ] },
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
      },
      computerWins: {
        $sum: {
          $cond: [
            { $eq: ["$computerWon", true] },
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

const twoPlayerPipeline = [
  { $match: {isSinglePlayerGame: false }},
  {
    $group: {
      _id: null,
      totalTwoPlayerGames: {$sum: 1 },
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
      },
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
      }
    }
  },
  {
    $project: { _id: 0 }
  }
];