"use client"

import { PlayerStats } from "@/types"
import type React from "react"

interface RadarChartProps {
  stats: PlayerStats
  size?: number
}

const RadarChart: React.FC<RadarChartProps> = ({ stats, size = 400 }) => {
  const center = size / 2
  const radius = (size / 2) * 0.8
  const angleStep = (Math.PI * 2) / 7

  // Convert stats to points on the radar
  const getPoint = (value: number, index: number) => {
    const angle = angleStep * index - Math.PI / 2
    const distance = (value / 100) * radius
    return {
      x: center + distance * Math.cos(angle),
      y: center + distance * Math.sin(angle),
    }
  }

  const statsArray = [
    { label: "SERVE", value: stats.serve },
    { label: "FOREHAND", value: stats.forehand },
    { label: "BACKHAND", value: stats.backhand },
    { label: "VOLLEY", value: stats.volley },
    { label: "MOVEMENT", value: stats.movement },
    { label: "MENTAL", value: stats.mental },
    { label: "FITNESS", value: stats.fitness },
  ]

  const points = statsArray.map((stat, i) => getPoint(stat.value, i))
  const pathData = points.map((point, i) => (i === 0 ? "M" : "L") + `${point.x},${point.y}`).join(" ") + "Z"

  return (
    <svg width={size} height={size} className="text-white">
      {/* Background circles */}
      {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
        <circle
          key={i}
          cx={center}
          cy={center}
          r={radius * scale}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity={0.2}
        />
      ))}

      {/* Stat lines */}
      {statsArray.map((_, i) => {
        const angle = angleStep * i - Math.PI / 2
        const x2 = center + radius * Math.cos(angle)
        const y2 = center + radius * Math.sin(angle)
        return (
          <line key={i} x1={center} y1={center} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1" opacity={0.2} />
        )
      })}

      {/* Stat labels */}
      {statsArray.map((stat, i) => {
        const point = getPoint(105, i)
        return (
          <text
            key={i}
            x={point.x}
            y={point.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs font-medium fill-current"
          >
            {stat.label}
          </text>
        )
      })}

      {/* Stats area */}
      <path d={pathData} fill="rgb(0, 144, 255)" fillOpacity={0.3} stroke="rgb(0, 144, 255)" strokeWidth="2" />
    </svg>
  )
}

export default RadarChart

