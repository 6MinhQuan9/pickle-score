import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export type MatchStatsProps = {
  stats: {
    duration: string
    totalPoints: number
    longestRally: number
  }
}

export function MatchStats({ stats }: MatchStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Match Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <li>
            <strong>Duration:</strong> {stats.duration}
          </li>
          <li>
            <strong>Total Points Played:</strong> {stats.totalPoints}
          </li>
          <li>
            <strong>Longest Rally:</strong> {stats.longestRally} shots
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}

