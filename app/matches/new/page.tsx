"use client";

import { useEffect, useState } from "react";
import { MatchForm, MatchFormData } from "@/components/match-form";
import { Player } from "@/types";
import { getPlayers } from "@/lib/db";
import { useRouter } from "next/navigation";

export default function NewMatchPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadPlayers = async () => {
      const players = await getPlayers();
      setPlayers(players);
    };
    loadPlayers();
  }, []);

  const handleSubmit = async (data: MatchFormData) => {
    try {
      const response = await fetch("/api/matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });
        // Show a more user-friendly error
        alert("Failed to save match. Please try again later.");
        return;
      }

      const result = await response.json();
      console.log("Success:", result);
      router.push("/matches");
    } catch (error) {
      console.error("Error details:", error);
      // Show a more user-friendly error
      alert("Error saving match. Please check your connection and try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-background/95 z-50">
        <h1 className="text-xl font-bold p-4 text-center">Add New Match</h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pt-16 pb-24">
        <div className="container max-w-md mx-auto p-4">
          <MatchForm players={players} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
