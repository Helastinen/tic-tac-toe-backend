const gameStats = {
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
    {
      "id": 2,
      "playerOne": "Alice",
      "playerTwo": "Bob",
      "status": "completed_with_tie"
    },
    {
      "id": 3,
      "playerOne": "Alice",
      "playerTwo": "Bob",
      "status": "completed_with_tie"
    },
    {
      "id": 4,
      "playerOne": "Alice",
      "playerTwo": "Bob",
      "status": "aborted"
    },
    {
      "id": 5,
      "playerOne": "Alice",
      "playerTwo": "Bob",
      "status": "aborted"
    },
    {
      "id": 6,
      "playerOne": "Alice",
      "playerTwo": "Bob",
      "status": "aborted"
    }
  ],
  "totalStats": {
    "playerOneWins": 1,
    "playerTwoWins": 0,
    "ties": 2,
    "aborted": 3
  }
};

module.exports = gameStats;