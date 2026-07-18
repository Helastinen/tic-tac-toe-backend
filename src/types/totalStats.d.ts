export interface AllGameStats {
  totalGames: number;
  playerOneWins: number;
  playerTwoWins: number;
  computerWins: number;
  ties: number;
  aborted: number;
  singlePlayerGames: number;
}

export interface SoloGameStats {
  totalSoloGames: number;
  humanWins: number;
  computerWins: number;
  ties: number;
  aborted: number;
}

export interface TwoPlayerGameStats {
  totalTwoPlayerGames: number;
  playerOneWins: number;
  playerTwoWins: number;
  ties: number;
  aborted: number;
}

export interface TotalStats {
  allGames: AllGameStats;
  soloGames: SoloGameStats;
  twoPlayerGames: TwoPlayerGameStats;
}