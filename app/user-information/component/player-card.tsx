"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Trophy } from "lucide-react"
import RadarChart from "./radar-chart"
import ProgressBar from "./progress-bar"
import { PlayerInfo } from "@/types"

interface PlayerCardProps {
  player: PlayerInfo
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  const [selectedYear, setSelectedYear] = useState<2014 | 2015 | 2016>(2016)

  return (
    <div className="w-full max-w-6xl mx-auto bg-[#0a1929] rounded-lg shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center space-x-4">
          {[2016, 2015, 2014].map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year as 2014 | 2015 | 2016)}
              className={`
                w-6 h-6 rounded-full flex items-center justify-center
                ${selectedYear === year ? "bg-[rgb(0,144,255)]" : "border border-white/30"}
              `}
            >
              <span className="text-xs text-white">{year}</span>
            </button>
          ))}
        </div>
        <div className="relative">
          <select className="bg-transparent text-white border border-white/30 rounded px-3 py-1 text-sm">
            <option>Performance</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 grid grid-cols-[2fr,1fr,2fr] gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-white">{player.name}</h1>
            <h2 className="text-[rgb(0,144,255)]">{player.position}</h2>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">{player.bio}</p>
          <div className="space-y-4">
            <div>
              <div className="text-white/50 text-sm">Current Ranking</div>
              <div className="text-white">#{player.ranking.current} ATP</div>
            </div>
            <div>
              <div className="text-white/50 text-sm">Career High Ranking</div>
              <div className="text-white">#{player.ranking.highest} ATP</div>
            </div>
            <div>
              <div className="text-white/50 text-sm">Date of Birth</div>
              <div className="text-white">{player.dateOfBirth}</div>
            </div>
            <div>
              <div className="text-white/50 text-sm">Place of Birth</div>
              <div className="text-white">{player.placeOfBirth}</div>
            </div>
            <div>
              <div className="text-white/50 text-sm">Height</div>
              <div className="text-white">{player.height}</div>
            </div>
          </div>
        </div>

        {/* Center Column - Player Image */}
        <div className="relative">
          <Image
            src={player.image || "/sample.jfif"}
            alt={player.name}
            width={300}
            height={400}
            className="object-contain"
          />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <RadarChart stats={player.stats} />
          <div className="space-y-4">
            <ProgressBar label="FIRST SERVE" value={player.skills.firstServePercentage} />
            <ProgressBar label="RETURN GAMES WON" value={player.skills.returnGamesWon} />
            <ProgressBar label="BREAK POINTS SAVED" value={player.skills.breakPointsSaved} />
            <ProgressBar label="WIN PERCENTAGE" value={player.skills.winPercentage} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-4 border-t border-white/10 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-[rgb(0,144,255)]" />
          <span className="text-white text-sm">Grand Slam Titles: 20</span>
        </div>
        <Image src="/placeholder.svg?height=30&width=60" alt="ATP Tour" width={60} height={30} className="opacity-50" />
      </div>
    </div>
  )
}

export default PlayerCard

