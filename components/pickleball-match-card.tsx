"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, formatDate } from "@/lib/utils";
import { Match, Player } from "@/types";
import { useRouter } from "next/navigation";

interface PickleballMatchCardProps {
  match: Match;
}

export function PickleballMatchCard({ match }: PickleballMatchCardProps) {
  console.log(match);
  const router = useRouter();
  const { players, match_date } = match;
  const team1Won = match.score.team1 > match.score.team2;
  const team2Won = match.score.team2 > match.score.team1;

  const handleCardClick = () => {
    router.push(`/match-detail/${match.id}`);
  };

  return (
    <Card className="w-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
      <CardContent className="p-5">
        <div className="flex items-stretch justify-between" onClick={handleCardClick}>
          <TeamSection players={players.team1} isWinner={team1Won} />

          <div className="flex flex-col items-center justify-center w-1/3">
            <div className="flex items-center justify-center gap-1">
              <span
                className={cn(
                  "text-xl font-bold tabular-nums",
                  team1Won && "text-primary"
                )}
              >
                {match.score.team1}
              </span>
              <span className="text-xl font-bold text-muted-foreground">-</span>
              <span
                className={cn(
                  "text-xl font-bold tabular-nums",
                  team2Won && "text-primary"
                )}
              >
                {match.score.team2}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {formatDate(match_date)}
            </div>
          </div>

          <TeamSection players={players.team2} isWinner={team2Won} />
        </div>
      </CardContent>
    </Card>
  );
}

interface TeamSectionProps {
  players: Player[];
  isWinner: boolean;
}

function TeamSection({ players, isWinner }: TeamSectionProps) {
  return (
    <div className="flex flex-col items-center w-1/3">
      <div
        className={cn(
          "flex -space-x-2 transition-transform mb-3",
          isWinner ? "scale-105" : "scale-100"
        )}
      >
        {players.map((player, index) => (
          <Avatar
            key={index}
            className={cn(
              "w-8 h-8 border-2 border-background transition-all duration-300",
              isWinner
                ? "ring-2 ring-primary ring-offset-1"
                : "ring-2 ring-muted ring-offset-1",
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
        ))}
      </div>
      <div className="text-center w-full space-y-1">
        {players.map((player, index) => (
          <div
            key={index}
            className={cn(
              "text-xs break-words transition-colors duration-300",
              isWinner ? "font-semibold text-primary" : "text-foreground",
              "hover:text-primary"
            )}
          >
            {player.username}
          </div>
        ))}
      </div>
    </div>
  );
}
