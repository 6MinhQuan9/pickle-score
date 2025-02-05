import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Player } from "@/types"

interface PlayerComboboxProps {
  players: Player[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function PlayerCombobox({ players, value, onChange, placeholder }: PlayerComboboxProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder || "Select player..."} />
      </SelectTrigger>
      <SelectContent>
        {players.map((player) => (
          <SelectItem 
            key={player.id} 
            value={player.id}
            className="flex items-center gap-2"
          >
            {player.username}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
} 