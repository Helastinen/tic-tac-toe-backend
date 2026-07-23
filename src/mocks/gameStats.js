const gameStats = {
  "gameHistory": [
    {
      "id": 1,
      "playerOne": "Alice",
      "playerTwo": "Bob",
      "winnerName": "Bob",
      "winningMark": "O",
      "gameLengthInMoves": 5,
      "status": "completed_with_winner",
      "singlePlayerGame": false
    },
    {
      "id": 2,
      "playerOne": "Alice",
      "playerTwo": "Bob",
      "status": "completed_with_tie",
      "singlePlayerGame": false
    },
    {
      "id": 3,
      "playerOne": "Alice",
      "playerTwo": "Computer",
      "status": "completed_with_tie",
      "singlePlayerGame": true,
      "computerWon": false

    },
    {
      "id": 4,
      "playerOne": "Alice",
      "playerTwo": "Bob",
      "status": "aborted",
      "singlePlayerGame": false,
    },
    {
      "id": 5,
      "playerOne": "Alice",
      "playerTwo": "Computer",
      "winnerName": "Computer",
      "winningMark": "O",
      "gameLengthInMoves": 5,
      "status": "completed_with_winner",
      "singlePlayerGame": true,
      "computerWon": true
    },
    {
      "id": 6,
      "playerOne": "Alice",
      "playerTwo": "Bob",
      "status": "aborted",
      "singlePlayerGame": false,
    }
  ],
  "totalStats": {
    "playerOneWins": 1,
    "playerTwoWins": 0,
    "ties": 2,
    "aborted": 2,
    "singlePlayerGame": 2,
    "computerWon": 1
  }
};

module.exports = gameStats;