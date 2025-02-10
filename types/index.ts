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
  date_of_birth?: string | number | Date;
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

export interface PlayerStats {
  serve: number;
  forehand: number;
  backhand: number;
  volley: number;
  movement: number;
  mental: number;
  fitness: number;
}

export interface PlayerSkills {
  firstServePercentage: number;
  returnGamesWon: number;
  breakPointsSaved: number;
  winPercentage: number;
}

export interface PlayerInfo {
  id: string;
  name: string;
  position: string; // e.g., "RIGHT-HANDED / ONE-HANDED BACKHAND"
  bio: string;
  dateOfBirth: string;
  placeOfBirth: string;
  height: string;
  image: string;
  ranking: {
    current: number;
    highest: number;
  };
  stats: PlayerStats;
  skills: PlayerSkills;
}
