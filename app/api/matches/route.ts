import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Start a transaction by creating the match first
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .insert({
        match_type: data.matchType,
        match_date: new Date().toISOString(),
      })
      .select()
      .single()

    if (matchError) throw matchError

    // Create teams
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .insert([
        {
          match_id: match.id,
          player1_id: data.team1.player1Id,
          player2_id: data.team1.player2Id || null
        },
        {
          match_id: match.id,
          player1_id: data.team2.player1Id,
          player2_id: data.team2.player2Id || null
        }
      ])
      .select('id')

    if (teamsError) throw teamsError

    // Create scores for each set
    const scores = data.sets.flatMap((set: any, index: number) => [
      {
        team_id: teams[0].id,
        set_number: index + 1,
        score: set.team1Score
      },
      {
        team_id: teams[1].id,
        set_number: index + 1,
        score: set.team2Score
      }
    ])

    const { error: scoresError } = await supabase
      .from('scores')
      .insert(scores)

    if (scoresError) throw scoresError

    return NextResponse.json({ success: true, matchId: match.id })
  } catch (error) {
    console.error('Error saving match:', error)
    return NextResponse.json(
      { error: 'Failed to save match', details: error }, 
      { status: 500 }
    )
  }
} 