import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Minus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Player, MatchResult } from "@/types";

interface PlayerRankingsProps {
  players: Player[];
  onPlayerSelect: (playerId: string) => void;
  selectedPlayer: string | null;
}

function ResultIcon({ type }: { type: MatchResult["type"] }) {
  return (
    <div
      className={cn(
        "rounded-full w-5 h-5 flex items-center justify-center",
        type === "win" && "bg-green-500 text-white",
        type === "loss" && "bg-red-500 text-white",
        type === "draw" && "bg-yellow-500 text-white",
        type === "none" && "bg-muted text-muted-foreground"
      )}
    >
      {type === "win" && <Check className="w-3 h-3" />}
      {type === "loss" && <X className="w-3 h-3" />}
      {type === "draw" && <Minus className="w-3 h-3" />}
      {type === "none" && <Minus className="w-3 h-3" />}
    </div>
  );
}

function getLastFiveGames(games: MatchResult[]): MatchResult[] {
  const results = [...games];
  while (results.length < 5) {
    results.push({ type: "none" });
  }
  return results.slice(-5);
}

export function PlayerRankings({
  players,
  onPlayerSelect,
  selectedPlayer,
}: PlayerRankingsProps) {
  return (
    <div className="w-full">
      <table className="w-full">
        <thead className="sticky top-0 bg-background z-10">
          <tr className="text-left">
            <th className="w-12 px-2 py-2 text-sm font-semibold">Rank</th>
            <th className="w-12 px-2 py-2"></th>
            <th className="px-2 py-2 text-sm font-semibold">Name</th>
            <th className="w-[100px] px-2 py-2 text-sm font-semibold text-right">
              Matches
            </th>
            <th className="w-[100px] px-2 py-2 text-sm font-semibold text-right">
              Win Rate
            </th>
            <th className="w-[140px] px-2 py-2 text-sm font-semibold text-right">
              Last 5
            </th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr
              key={player.id}
              className={cn(
                "hover:bg-muted/50 cursor-pointer transition-colors",
                selectedPlayer === player.id && "bg-muted"
              )}
              onClick={() => onPlayerSelect(player.id)}
            >
              <td className="w-12 px-2 py-2 text-center font-bold text-sm">
                {player.rank}
              </td>
              <td className="w-12 px-2 py-2">
                <Avatar
                  className={cn(
                    "w-8 h-8 border-2 border-background transition-all duration-300",
                    "ring-2 ring-muted ring-offset-1",
                    "hover:scale-110 hover:z-10"
                  )}
                >
                  <AvatarImage
                    src={`/${player.avatarUrl}`}
                    alt={player.username}
                    className="object-cover"
                  />
                  <AvatarFallback>{player.username.charAt(0)}</AvatarFallback>
                </Avatar>
              </td>
              <td className="px-2 py-2 text-sm">{player.username}</td>
              <td className="w-[100px] px-2 py-2 text-sm text-right">
                {player.stats.matchesPlayed}
              </td>
              <td className="w-[100px] px-2 py-2 text-sm text-right">
                {player.stats.winRate.toFixed(1)}%
              </td>
              <td className="w-[140px] px-2 py-2">
                <div className="flex gap-1 justify-end">
                  {getLastFiveGames(player.lastGames).map((result, index) => (
                    <ResultIcon key={index} type={result.type} />
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
