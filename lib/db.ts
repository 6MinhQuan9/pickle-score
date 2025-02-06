import { supabase } from "./supabase";
import { Match, Player, DatabaseMatch } from "@/types";
import { formatDateTime } from "@/lib/utils";

interface PlayerStatistics {
  id: string;
  username: string;
  avatar_url: string | null;
  rank: number;
  wins: number;
  losses: number;
  score: number;
  win_rate: number;
  matches_played: number;
  last_games: { type: "win" | "loss" | "draw" }[];
}

export async function getPlayers(): Promise<Player[]> {
  const { data: statsData, error: statsError } = await supabase
    .from("player_statistics")
    .select("*");

  if (statsError) throw statsError;

  return (statsData as PlayerStatistics[]).map((stat) => ({
    id: stat.id,
    username: stat.username,
    avatarUrl: stat.avatar_url ?? undefined,
    rank: stat.rank,
    stats: {
      wins: stat.wins,
      losses: stat.losses,
      score: stat.score,
      winRate: stat.win_rate,
      matchesPlayed: stat.matches_played,
    },
    lastGames: stat.last_games || [],
  }));
}

export async function getMatches(): Promise<Match[]> {
  const { data, error } = await supabase
    .from("matches")
    .select(
      `
      *,
      teams!teams_match_id_fkey (
        id,
        player1:players!teams_player1_id_fkey (id, username, avatar_url),
        player2:players!teams_player2_id_fkey (id, username, avatar_url),
        scores (
          set_number,
          score
        )
      )
    `
    )
    .order("match_date", { ascending: false })
    .limit(10);

  if (error) throw error;

  return (data as DatabaseMatch[]).map((match) => {
    const [team1, team2] = match.teams;

    const team1SetsWon = team1.scores.filter((s1) => {
      const team2Score = team2.scores.find(
        (s2) => s2.set_number === s1.set_number
      );
      return s1.score > (team2Score?.score || 0);
    }).length;

    const team2SetsWon = team2.scores.filter((s1) => {
      const team1Score = team1.scores.find(
        (s2) => s2.set_number === s1.set_number
      );
      return s1.score > (team1Score?.score || 0);
    }).length;

    return {
      id: match.id,
      match_type: match.match_type,
      match_date: formatDateTime(match.match_date),
      location: match.location ?? undefined,
      players: {
        team1: [team1.player1, ...(team1.player2 ? [team1.player2] : [])],
        team2: [team2.player1, ...(team2.player2 ? [team2.player2] : [])],
      },
      score: {
        team1: team1SetsWon,
        team2: team2SetsWon,
      },
    };
  });
}

export async function getPlayerById(id: string): Promise<Player | null> {
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}
