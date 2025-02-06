-- Drop the existing view
DROP VIEW IF EXISTS player_statistics;

-- Create new version with draws support
CREATE OR REPLACE VIEW player_statistics AS
WITH match_results AS (
    -- Get all matches with team information, ensuring each match is counted once
    SELECT DISTINCT
        m.id as match_id,
        m.match_date,
        t1.id as team1_id,
        t2.id as team2_id,
        t1.player1_id as t1p1,
        t1.player2_id as t1p2,
        t2.player1_id as t2p1,
        t2.player2_id as t2p2,
        -- Calculate winner based on sets won
        CASE 
            WHEN (
                SELECT COUNT(*)
                FROM scores s1
                WHERE s1.team_id = t1.id
                AND s1.score > COALESCE((
                    SELECT s2.score
                    FROM scores s2
                    WHERE s2.team_id = t2.id
                    AND s2.set_number = s1.set_number
                ), 0)
            ) > (
                SELECT COUNT(*)
                FROM scores s2
                WHERE s2.team_id = t2.id
                AND s2.score > COALESCE((
                    SELECT s1.score
                    FROM scores s1
                    WHERE s1.team_id = t1.id
                    AND s1.set_number = s2.set_number
                ), 0)
            )
            THEN t1.id  -- team1 wins
            WHEN (
                SELECT COUNT(*)
                FROM scores s1
                WHERE s1.team_id = t1.id
                AND s1.score > COALESCE((
                    SELECT s2.score
                    FROM scores s2
                    WHERE s2.team_id = t2.id
                    AND s2.set_number = s1.set_number
                ), 0)
            ) = (
                SELECT COUNT(*)
                FROM scores s2
                WHERE s2.team_id = t2.id
                AND s2.score > COALESCE((
                    SELECT s1.score
                    FROM scores s1
                    WHERE s1.team_id = t1.id
                    AND s1.set_number = s2.set_number
                ), 0)
            )
            THEN NULL  -- draw
            ELSE t2.id  -- team2 wins
        END as winner_team_id
    FROM matches m
    JOIN teams t1 ON t1.match_id = m.id
    JOIN teams t2 ON t2.match_id = m.id AND t2.id > t1.id  -- Only get unique team combinations
),
player_matches AS (
    -- Get match results for each player, ensuring each match is counted once per player
    SELECT DISTINCT
        p.id as player_id,
        mr.match_id,
        mr.match_date,
        CASE 
            WHEN (p.id IN (mr.t1p1, mr.t1p2) AND mr.winner_team_id = mr.team1_id) OR
                 (p.id IN (mr.t2p1, mr.t2p2) AND mr.winner_team_id = mr.team2_id)
            THEN 'win'
            WHEN mr.winner_team_id IS NULL
            THEN 'draw'
            ELSE 'loss'
        END as result
    FROM players p
    JOIN match_results mr ON p.id IN (mr.t1p1, mr.t1p2, mr.t2p1, mr.t2p2)
),
player_stats AS (
    -- Calculate statistics for each player
    SELECT 
        p.id,
        p.username,
        p.avatar_url,
        COUNT(DISTINCT pm.match_id) as matches_played,
        COUNT(DISTINCT CASE WHEN pm.result = 'win' THEN pm.match_id END) as wins,
        COUNT(DISTINCT CASE WHEN pm.result = 'loss' THEN pm.match_id END) as losses,
        COUNT(DISTINCT CASE WHEN pm.result = 'draw' THEN pm.match_id END) as draws,
        ROUND(
            COALESCE(
                COUNT(DISTINCT CASE WHEN pm.result = 'win' THEN pm.match_id END)::numeric / 
                NULLIF(COUNT(DISTINCT pm.match_id), 0) * 100,
                0
            ),
            2
        ) as win_rate,
        -- Score calculation (unchanged as it seems good)
        (
            COUNT(DISTINCT CASE WHEN pm.result = 'win' THEN pm.match_id END) * 100
        ) + (
            ROUND(
                COALESCE(
                    COUNT(DISTINCT CASE WHEN pm.result = 'win' THEN pm.match_id END)::numeric / 
                    NULLIF(COUNT(DISTINCT pm.match_id), 0) * 50,
                    0
                ),
                2
            )
        ) + (
            LEAST(COUNT(DISTINCT pm.match_id), 50)
        ) + (
            COUNT(DISTINCT CASE WHEN pm.result = 'draw' THEN pm.match_id END) * 50
        ) as score
    FROM players p
    LEFT JOIN player_matches pm ON p.id = pm.player_id
    GROUP BY p.id, p.username, p.avatar_url
),
last_five_games AS (
    -- Get last 5 games for each player
    SELECT 
        player_id,
        json_agg(
            json_build_object('type', result)
            ORDER BY match_date DESC
            LIMIT 5
        ) FILTER (WHERE match_date IS NOT NULL) as last_games
    FROM player_matches
    GROUP BY player_id
)
-- Final selection combining all statistics
SELECT 
    ps.*,
    COALESCE(lfg.last_games, '[]'::json) as last_games,
    DENSE_RANK() OVER (
        ORDER BY 
            ps.score DESC,
            ps.matches_played DESC,
            ps.win_rate DESC,
            ps.id
    ) as rank
FROM player_stats ps
LEFT JOIN last_five_games lfg ON ps.id = lfg.player_id
ORDER BY rank, ps.score DESC, ps.matches_played DESC;