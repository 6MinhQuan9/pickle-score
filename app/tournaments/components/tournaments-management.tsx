"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import TournamentBracket from "@/components/tournament-bracket"
import { Player, Tournament } from "../tournaments-types"

const TournamentManagement: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null)
  const [newTournamentName, setNewTournamentName] = useState("")
  const [newPlayerName, setNewPlayerName] = useState("")
  const [showBracket, setShowBracket] = useState(false)

  const createTournament = () => {
    if (newTournamentName) {
      const newTournament: Tournament = {
        id: `tournament-${Date.now()}`,
        name: newTournamentName,
        players: [],
      }
      setTournaments([...tournaments, newTournament])
      setSelectedTournament(newTournament)
      setNewTournamentName("")
    }
  }

  const addPlayer = () => {
    if (selectedTournament && newPlayerName) {
      const newPlayer: Player = {
        id: `player-${Date.now()}`,
        name: newPlayerName.toUpperCase(), // Match the image style
        seed: selectedTournament.players.length + 1,
      }
      const updatedTournament = {
        ...selectedTournament,
        players: [...selectedTournament.players, newPlayer],
      }
      setSelectedTournament(updatedTournament)
      setTournaments(tournaments.map((t) => (t.id === selectedTournament.id ? updatedTournament : t)))
      setNewPlayerName("")
    }
  }

  const startTournament = () => {
    if (selectedTournament && selectedTournament.players.length >= 2) {
      setShowBracket(true)
    }
  }

  if (showBracket && selectedTournament) {
    return <TournamentBracket players={selectedTournament.players} />
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tournament Management</h1>

      {/* Create Tournament Form */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Create New Tournament</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Tournament Name"
              value={newTournamentName}
              onChange={(e) => setNewTournamentName(e.target.value)}
            />
            <Button onClick={createTournament}>Create</Button>
          </div>
        </CardContent>
      </Card>

      {/* Tournament List */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Tournaments</CardTitle>
        </CardHeader>
        <CardContent>
          {tournaments.map((tournament) => (
            <Button
              key={tournament.id}
              variant={selectedTournament?.id === tournament.id ? "default" : "outline"}
              className="mr-2 mb-2"
              onClick={() => setSelectedTournament(tournament)}
            >
              {tournament.name}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Selected Tournament Management */}
      {selectedTournament && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>{selectedTournament.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">Players ({selectedTournament.players.length})</h3>
            <ul className="mb-4">
              {selectedTournament.players.map((player) => (
                <li key={player.id} className="mb-1">
                  {player.name} (Seed: {player.seed})
                </li>
              ))}
            </ul>
            <div className="flex items-center space-x-2 mb-4">
              <Input
                placeholder="Player Name"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    addPlayer()
                  }
                }}
              />
              <Button onClick={addPlayer}>Add Player</Button>
            </div>
            <Button onClick={startTournament} disabled={selectedTournament.players.length < 2} className="w-full">
              Start Tournament
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default TournamentManagement

