export interface AllGameStats {
  totalGames: number;
  wins: number;
  ties: number;
  aborted: number;
  averageGameLength: number;
}

export interface SoloGameStats {
  totalSoloGames: number;
  humanWins: number;
  computerWins: number;
  ties: number;
  aborted: number;
  averageGameLength: number;
}

export interface TwoPlayerGameStats {
  totalTwoPlayerGames: number;
  playerOneWins: number;
  playerTwoWins: number;
  ties: number;
  aborted: number;
  averageGameLength: number;
}

export interface TotalStats {
  allGames: AllGameStats;
  soloGames: SoloGameStats;
  twoPlayerGames: TwoPlayerGameStats;
}