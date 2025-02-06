"use client";

import { Match } from "@/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getMatchDetail } from "@/lib/db";
import { MatchDetails } from "@/components/match-details";
import { MatchStats } from "@/components/match-stats";

export default function MatchDetail() {
  const { id } = useParams();
  const [match, setMatch] = useState<Match | null>(null);

  useEffect(() => {
    async function getDetailMatch() {
      if (!id) {
        return;
      }

      const detailMatch = await getMatchDetail(id.toString());
      setMatch(detailMatch);
    }

    getDetailMatch();
  }, [id]);

  if (!match) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Pickleball Match Details</h1>
      <p className="mb-4">Viewing Match</p>
      <MatchDetails match={match as Match} />
      <MatchStats stats={{
        duration: "",
        totalPoints: 0,
        longestRally: 0
      }} />
    </div>
  );
}
