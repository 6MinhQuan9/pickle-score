import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Match } from "@/types";

function PlayerAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  const avatarUrl = `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(
    name
  )}`;

  return (
    <Avatar className="mr-2">
      <AvatarImage src={avatarUrl} alt={name} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}

export function MatchDetails({ match }:  { match: Match }) {
  console.log("detail", match);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Match Information</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          <strong>Date:</strong> {match.match_date}
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Team A</h3>
            <ul>
              {match?.players?.team1?.map((player, index) => (
                <li key={index} className="flex items-center mb-2">
                  <PlayerAvatar name={player.username} />
                  {player.username}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Team B</h3>
            <ul>
              {match?.players?.team2?.map((player, index) => (
                <li key={index} className="flex items-center mb-2">
                  <PlayerAvatar name={player.username} />
                  {player.username}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Final Score</h3>
          <p>
            Team A: {match?.score?.team1} - Team B: {match?.score?.team2}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
