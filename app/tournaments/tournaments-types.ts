export interface Player {
  id: string;
  name: string;
  seed: number;
  score?: number;
  logo?: string;
}

export interface Match {
  id: string;
  roundIndex: number;
  matchIndex: number;
  team1?: Player;
  team2?: Player;
  winner?: Player;
  nextMatchId?: string;
  time?: string;
  channel?: string;
}

export interface Round {
  matches: Match[];
}

export interface TournamentStructure {
  rounds: Round[];
  totalRounds: number;
}

export interface Tournament {
  id: string;
  name: string;
  players: Player[];
  structure?: TournamentStructure;
}
