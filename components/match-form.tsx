"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, Plus, Minus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Player } from "@/types";
import { PlayerCombobox } from "./player-combobox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn, formatDateTimeISO } from "@/lib/utils";

interface MatchFormProps {
  players: Player[];
  onSubmit: (data: MatchFormData) => Promise<void>;
}

export interface MatchFormData {
  matchType: "Singles" | "Doubles";
  matchDate: Date;
  team1: {
    player1Id: string;
    player2Id?: string;
  };
  team2: {
    player1Id: string;
    player2Id?: string;
  };
  sets: Array<{
    team1Score: number | undefined;
    team2Score: number | undefined;
  }>;
}

export function MatchForm({ players, onSubmit }: MatchFormProps) {
  const router = useRouter();
  const [matchType, setMatchType] = useState<"Singles" | "Doubles">("Singles");
  const [matchDate, setMatchDate] = useState<Date>(new Date());
  const [team1Player1, setTeam1Player1] = useState<string>("");
  const [team1Player2, setTeam1Player2] = useState<string>("");
  const [team2Player1, setTeam2Player1] = useState<string>("");
  const [team2Player2, setTeam2Player2] = useState<string>("");
  const [sets, setSets] = useState<
    Array<{ team1Score: number; team2Score: number }>
  >([{ team1Score: 0, team2Score: 0 }]);
  const { toast } = useToast();

  const handleSetScoreChange = (
    setIndex: number,
    team: 1 | 2,
    value: string
  ) => {
    console.log(value);
    const newSets = [...sets];
    const score = value === "" ? undefined : parseInt(value) || 0; // Handle empty input and NaN
    if (team === 1) {
      newSets[setIndex].team1Score = score;
    } else {
      newSets[setIndex].team2Score = score;
    }
    setSets(newSets);
  };

  const addSet = () => {
    setSets([...sets, { team1Score: 0, team2Score: 0 }]);
  };

  const removeSet = (index: number) => {
    if (sets.length > 1) {
      setSets(sets.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate date
    if (!matchDate) {
      toast({
        title: "Error",
        description: "Please select a match date",
        variant: "destructive",
      });
      return;
    }

    // Validate players
    if (!team1Player1 || !team2Player1) {
      toast({
        title: "Error",
        description: "Please select players for both teams",
        variant: "destructive",
      });
      return;
    }

    if (matchType === "Doubles" && (!team1Player2 || !team2Player2)) {
      toast({
        title: "Error",
        description: "Please select all players for doubles match",
        variant: "destructive",
      });
      return;
    }

    // Validate scores
    if (
      sets.some(
        (set) =>
          set.team1Score === undefined ||
          set.team2Score === undefined ||
          (set.team1Score === 0 && set.team2Score === 0)
      )
    ) {
      toast({
        title: "Error",
        description: "Please enter valid scores for all sets",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          matchType,
          matchDate: formatDateTimeISO(matchDate),
          team1: {
            player1Id: team1Player1,
            player2Id: matchType === "Doubles" ? team1Player2 : undefined,
          },
          team2: {
            player1Id: team2Player1,
            player2Id: matchType === "Doubles" ? team2Player2 : undefined,
          },
          sets: sets.map((set) => ({
            team1Score: set.team1Score || 0,
            team2Score: set.team2Score || 0,
          })),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || "Failed to save match");
      }

      toast({
        title: "Success",
        description: "Match saved successfully",
      });

      // Redirect back to home page and refresh data
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error saving match:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save match",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative">
      <Card className="w-full bg-background">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Match Type Section */}
            <div className="p-4 bg-muted/30 rounded-lg space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">
                Match Type
              </h2>
              <RadioGroup
                value={matchType}
                onValueChange={(value: "Singles" | "Doubles") =>
                  setMatchType(value)
                }
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Singles" id="singles" />
                  <Label htmlFor="singles">Singles</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Doubles" id="doubles" />
                  <Label htmlFor="doubles">Doubles</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Match Date Section */}
            <div className="p-4 bg-muted/30 rounded-lg space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">
                Match Date
              </h2>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !matchDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {matchDate ? (
                      format(matchDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={matchDate}
                    onSelect={(date) => date && setMatchDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Teams Section */}
            <div className="p-4 bg-muted/30 rounded-lg space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Teams</h2>
              {/* Team 1 Section */}
              <Collapsible className="w-full">
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                  <span>Team 1</span>
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 space-y-4 bg-muted/50 rounded-lg mt-2">
                  <PlayerCombobox
                    players={players}
                    value={team1Player1}
                    onChange={setTeam1Player1}
                    placeholder="Select Player 1"
                  />
                  {matchType === "Doubles" && (
                    <PlayerCombobox
                      players={players}
                      value={team1Player2}
                      onChange={setTeam1Player2}
                      placeholder="Select Player 2"
                    />
                  )}
                </CollapsibleContent>
              </Collapsible>

              {/* Team 2 Section */}
              <Collapsible className="w-full">
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                  <span>Team 2</span>
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 space-y-4 bg-muted/50 rounded-lg mt-2">
                  <PlayerCombobox
                    players={players}
                    value={team2Player1}
                    onChange={setTeam2Player1}
                    placeholder="Select Player 1"
                  />
                  {matchType === "Doubles" && (
                    <PlayerCombobox
                      players={players}
                      value={team2Player2}
                      onChange={setTeam2Player2}
                      placeholder="Select Player 2"
                    />
                  )}
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* Sets Section */}
            <div className="p-4 bg-muted/30 rounded-lg space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Sets</h2>
              <div className="space-y-4">
                {sets.map((set, index) => (
                  <div
                    key={index}
                    className="p-4 bg-muted rounded-lg space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        Set {index + 1}
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeSet(index)}
                        disabled={sets.length === 1}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-grow grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-sm">Team 1</Label>
                          <Input
                            type="number"
                            min="0"
                            value={set.team1Score}
                            onChange={(e) =>
                              handleSetScoreChange(index, 1, e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Team 2</Label>
                          <Input
                            type="number"
                            min="0"
                            value={set.team2Score}
                            onChange={(e) =>
                              handleSetScoreChange(index, 2, e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={addSet}
                  disabled={sets.length >= 5}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Set
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Fixed Save Button - Centered */}
      <div className="fixed bottom-0 left-0 right-0 p-4 z-50">
        <div className="container max-w-md mx-auto px-4">
          <div className="max-w-[200px] mx-auto">
            <Button
              type="submit"
              className="w-full"
              size="lg"
              onClick={(e) => handleSubmit(e)}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
