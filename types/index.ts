export type UUID = string;

export interface MatchResult {
  type: "win" | "loss" | "draw" | "none";
}

export interface Player {
  id: UUID;
  username: string;
  avatarUrl?: string;
  rank: number;
  stats: {
    wins: number;
    losses: number;
    score: number;
    winRate: number;
    matchesPlayed: number;
  };
  lastGames: MatchResult[];
  date_of_birth?: string| number | Date;
  level: "Beginner" | "Intermediate" | "Advanced";
  gender: "Male" | "Female";
}

export interface Score {
  set_number: number;
  team_id: UUID;
  score: number;
}

export interface Team {
  id: UUID;
  player1: Player;
  player2?: Player;
  scores: Score[];
}

export interface DatabaseMatch {
  id: UUID;
  match_type: "Singles" | "Doubles";
  match_date: string;
  location: string | null;
  teams: Team[];
}

export interface Match {
  id: UUID;
  match_type: "Singles" | "Doubles";
  match_date: string;
  location?: string;
  players: {
    team1: Player[];
    team2: Player[];
  };
  score: {
    team1: number;
    team2: number;
  };
}
