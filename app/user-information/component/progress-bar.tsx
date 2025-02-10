import type React from "react"

interface ProgressBarProps {
  label: string
  value: number
  suffix?: string
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, value, suffix = "%" }) => {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <div className="text-white text-sm uppercase tracking-wider">{label}</div>
        <div className="text-[rgb(0,144,255)] text-sm font-medium">
          {value}
          {suffix}
        </div>
      </div>
      <div className="h-1 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-[rgb(0,144,255)] rounded-full transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar

