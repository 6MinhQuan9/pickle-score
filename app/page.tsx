"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PickleballMatchCard } from "@/components/pickleball-match-card"
import { PlayerRankings } from "@/components/player-rankings"
import { Match, Player } from "@/types"
import { getMatches, getPlayers } from "@/lib/db"
import { Button } from '@/components/ui/button'

export default function Home() {
  const router = useRouter()
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const playersData = await getPlayers()
        setPlayers(playersData)
      } catch (error) {
        console.error('Error loading players data:', error)
      }

      try {
        const matchesData = await getMatches()
        setMatches(matchesData)
      } catch (error) {
        console.error('Error loading matches data:', error)
      }

      setLoading(false)
    }

    loadData()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-6 text-center">Pickleball Match History</h1>

      <div className="flex-1 flex flex-col space-y-6 overflow-hidden">
        <section className="flex-1 flex flex-col min-h-0">
          <h2 className="text-lg font-semibold mb-2">Rankings</h2>
          <div className="flex-1 overflow-hidden bg-background rounded-lg shadow">
            <div className="h-full overflow-y-auto scrollbar-hide">
              <PlayerRankings
                players={players}
                onPlayerSelect={(playerId) => setSelectedPlayer(playerId)}
                selectedPlayer={selectedPlayer}
              />
            </div>
          </div>
        </section>

        <section className="flex-1 flex flex-col min-h-0">
          <h2 className="text-lg font-semibold mb-2">Last Results</h2>
          <div className="flex-1 overflow-y-auto bg-background rounded-lg shadow scrollbar-hide">
            <div className="space-y-4 p-4">
              {matches.map((match) => (
                <PickleballMatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 z-50">
        <div className="container max-w-md mx-auto px-4">
          <div className="max-w-[200px] mx-auto">
            <Button 
              type="submit" 
              className="w-full"
              size="lg"
              onClick={() => router.push('/matches/new')}
            >
              Add New Match
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
