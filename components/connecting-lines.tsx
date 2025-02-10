import { Round } from "@/app/tournaments/tournaments-types"
import type React from "react"

interface ConnectingLinesProps {
  rounds: Round[]
}

const ConnectingLines: React.FC<ConnectingLinesProps> = ({ rounds }) => {
  const svgWidth = rounds.length * 280 // Adjust based on your layout
  const svgHeight = 100 * 2 ** (rounds.length - 1) // Adjust based on your layout

  return (
    <svg
      className="absolute top-0 left-0 w-full h-full -z-10"
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
    >
      {rounds.slice(0, -1).map((round, roundIndex) => {
        const startX = (roundIndex + 1) * 280 - 20 // Adjust based on your layout
        const matchesInRound = round.matches.length
        const gapBetweenMatches = svgHeight / matchesInRound

        return round.matches.map((match, matchIndex) => {
          if (!match.nextMatchId) return null

          const startY = gapBetweenMatches * (matchIndex + 0.5)
          const nextRound = rounds[roundIndex + 1]
          const nextMatch = nextRound.matches.find((m) => m.id === match.nextMatchId)

          if (!nextMatch) return null

          const endX = startX + 280 // Adjust based on your layout
          const endY = (svgHeight / nextRound.matches.length) * (nextMatch.matchIndex + 0.5)

          const midX = (startX + endX) / 2

          return (
            <g key={`${roundIndex}-${matchIndex}`}>
              <path
                d={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
                fill="none"
                stroke="#CBD5E0"
                strokeWidth="2"
              />
              {match.winner && (
                <path
                  d={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
                  fill="none"
                  stroke="#4CAF50"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              )}
            </g>
          )
        })
      })}
    </svg>
  )
}

export default ConnectingLines

