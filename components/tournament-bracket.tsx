"use client";

import type React from "react";
import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import ConnectingLines from "./connecting-lines";
import {
  Player,
  Round,
  TournamentStructure,
} from "@/app/tournaments/tournaments-types";

interface TournamentBracketProps {
  players: Player[];
}

export interface Match {
  id: string;
  roundIndex: number;
  matchIndex: number;
  nextMatchId?: string;
  winner?: Player;
  player1?: Player;
  player2?: Player;
}

const initializeTournament = (players: Player[]): TournamentStructure => {
  const totalPlayers = players.length;
  const totalRounds = Math.ceil(Math.log2(totalPlayers));
  const rounds: Round[] = [];

  // Calculate the number of byes
  const totalSlots = 2 ** totalRounds;
  const byes = totalSlots - totalPlayers;

  // Create first round matches
  const firstRound: Match[] = [];
  let matchIndex = 0;
  let playerIndex = 0;

  for (let i = 0; i < totalSlots / 2; i++) {
    const match: Match = {
      id: `r1-m${i}`,
      roundIndex: 0,
      matchIndex: i,
      nextMatchId: `r2-m${Math.floor(i / 2)}`,
    };

    if (playerIndex < players.length) {
      match.player1 = players[playerIndex++];
    }

    if (playerIndex < players.length) {
      match.player2 = players[playerIndex++];
    } else if (byes > 0) {
      // If there's a bye, advance player1 to the next round
      match.winner = match.player1;
    }

    firstRound.push(match);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    matchIndex++;
  }

  rounds.push({ matches: firstRound });

  // Create subsequent rounds
  for (let round = 1; round < totalRounds; round++) {
    const roundMatches: Match[] = [];
    const matchesInRound = 2 ** (totalRounds - round - 1);

    for (let i = 0; i < matchesInRound; i++) {
      roundMatches.push({
        id: `r${round + 1}-m${i}`,
        roundIndex: round,
        matchIndex: i,
        nextMatchId:
          round < totalRounds - 1
            ? `r${round + 2}-m${Math.floor(i / 2)}`
            : undefined,
      });
    }

    rounds.push({ matches: roundMatches });
  }

  return { rounds, totalRounds };
};

const MatchCard: React.FC<{
  match: Match;
  onSelectWinner: (matchId: string, winner: Player) => void;
  isCurrentRound: boolean;
}> = ({ match, onSelectWinner, isCurrentRound }) => {
  const isMatchReady = match.player1 && match.player2;
  const isCompleted = Boolean(match.winner);
  const isChampion = !match.nextMatchId && match.winner;

  return (
    <div className="relative">
      <Card
        className={`
        w-60 
        p-4 
        ${isChampion ? "bg-yellow-300" : "bg-white"}
        ${!isMatchReady ? "opacity-50" : ""}
        transition-all
        duration-200
        shadow-md
      `}
      >
        {/* Player 1 */}
        <div
          className={`
          flex justify-between items-center p-2 rounded
          ${
            isCurrentRound && !isCompleted && match.player1
              ? "hover:bg-blue-100 cursor-pointer"
              : ""
          }
          ${match.winner?.id === match.player1?.id ? "bg-green-100" : ""}
        `}
          onClick={() => {
            if (isCurrentRound && !isCompleted && match.player1) {
              onSelectWinner(match.id, match.player1);
            }
          }}
        >
          <span className="font-medium">{match.player1?.name || "TBD"}</span>
          <span className="text-sm text-gray-500">
            ({match.player1?.seed || "-"})
          </span>
        </div>

        {/* Player 2 */}
        <div
          className={`
          flex justify-between items-center p-2 rounded mt-2
          ${
            isCurrentRound && !isCompleted && match.player2
              ? "hover:bg-blue-100 cursor-pointer"
              : ""
          }
          ${match.winner?.id === match.player2?.id ? "bg-green-100" : ""}
        `}
          onClick={() => {
            if (isCurrentRound && !isCompleted && match.player2) {
              onSelectWinner(match.id, match.player2);
            }
          }}
        >
          <span className="font-medium">{match.player2?.name || "TBD"}</span>
          <span className="text-sm text-gray-500">
            ({match.player2?.seed || "-"})
          </span>
        </div>

        {isChampion && (
          <div className="absolute -right-4 -top-4">
            <Trophy className="w-8 h-8 text-yellow-600" />
          </div>
        )}
      </Card>
    </div>
  );
};

const TournamentBracket: React.FC<TournamentBracketProps> = ({ players }) => {
  const [tournament, setTournament] = useState<TournamentStructure>(() =>
    initializeTournament(players)
  );
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  
  const handleWinnerSelection = useCallback(
    (matchId: string, winner: Player) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setTournament((prevTournament: any) => {
        const newTournament = {
          ...prevTournament,
          rounds: [...prevTournament.rounds],
        };

        // Find and update the current match
        const currentRound = newTournament.rounds[currentRoundIndex];
        const currentMatch = currentRound.matches.find(
          (m: Match) => m.id === matchId
        );
        if (!currentMatch) return prevTournament;

        currentMatch.winner = winner;

        // If this match has a next match, update the next match's players
        if (currentMatch.nextMatchId) {
          const nextRound = newTournament.rounds[currentRoundIndex + 1];
          const nextMatch = nextRound.matches.find(
            (m: Match) => m.id === currentMatch.nextMatchId
          );
          if (nextMatch) {
            if (currentMatch.matchIndex % 2 === 0) {
              nextMatch.player1 = winner;
            } else {
              nextMatch.player2 = winner;
            }
          }
        }

        // Check if current round is complete
        const isRoundComplete = currentRound.matches.every(
          (m: Match) => m.winner
        );

        if (
          isRoundComplete &&
          currentRoundIndex < newTournament.totalRounds - 1
        ) {
          setCurrentRoundIndex(() => {
            return currentRoundIndex + 1;
          });
        }

        return newTournament;
      });
    },
    [currentRoundIndex]
  );

  const resetTournament = () => {
    setTournament(initializeTournament(players));
    setCurrentRoundIndex(0);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-8">
      <Button onClick={resetTournament} variant="outline" className="mb-8">
        Reset Tournament
      </Button>

      <div className="relative overflow-x-auto">
        <ConnectingLines rounds={tournament.rounds} />
        <div className="flex gap-20">
          {tournament.rounds.map((round, roundIndex) => (
            <div
              key={roundIndex}
              className={`
                flex flex-col justify-around
                ${roundIndex > 0 ? "mt-16" : ""}
              `}
              // style={{ height: `${100 * 2 ** roundIndex}px` }}
            >
              {round.matches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  onSelectWinner={handleWinnerSelection}
                  isCurrentRound={roundIndex === currentRoundIndex}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TournamentBracket;
