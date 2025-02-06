import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("Received data:", data); // Debug log

    // Start a transaction by creating the match first
    const { data: match, error: matchError } = await supabase
      .from("matches")
      .insert({
        match_type: data.matchType,
        match_date: data.matchDate,
      })
      .select()
      .single();

    if (matchError) {
      console.error("Match creation error:", matchError);
      throw matchError;
    }

    console.log("Created match:", match); // Debug log

    // Create teams
    const { data: teams, error: teamsError } = await supabase
      .from("teams")
      .insert([
        {
          match_id: match.id,
          player1_id: data.team1.player1Id,
          player2_id: data.team1.player2Id || null,
        },
        {
          match_id: match.id,
          player1_id: data.team2.player1Id,
          player2_id: data.team2.player2Id || null,
        },
      ])
      .select("id, match_id"); // Also select match_id to verify

    if (teamsError) {
      console.error("Teams creation error:", teamsError);
      throw teamsError;
    }

    console.log("Created teams:", teams); // Debug log

    if (!teams || teams.length !== 2) {
      throw new Error("Failed to create both teams");
    }

    // Create scores for each set with explicit match_id
    const scores = data.sets.flatMap((set: any, index: number) => [
      {
        match_id: match.id, // Add match_id here
        team_id: teams[0].id,
        set_number: index + 1,
        score: set.team1Score,
      },
      {
        match_id: match.id, // Add match_id here
        team_id: teams[1].id,
        set_number: index + 1,
        score: set.team2Score,
      },
    ]);

    console.log("Preparing to insert scores:", scores); // Debug log

    const { error: scoresError } = await supabase.from("scores").insert(scores);

    if (scoresError) {
      console.error("Scores creation error:", scoresError);
      throw scoresError;
    }

    return NextResponse.json({
      success: true,
      matchId: match.id,
      details: {
        match,
        teams,
        scoresCount: scores.length,
      },
    });
  } catch (error) {
    console.error("Error saving match:", error);
    return NextResponse.json(
      {
        error: "Failed to save match",
        details: error,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
