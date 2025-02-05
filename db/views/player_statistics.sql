-- Drop the existing view
DROP VIEW IF EXISTS player_statistics;

-- Create new version with draws support
CREATE OR REPLACE VIEW player_statistics AS
WITH match_results AS (
    -- Get all matches with team information
    SELECT 
        m.id as match_id,
        m.match_date,
        t1.id as team1_id,
        t1.player1_id as t1p1, 
        t1.player2_id as t1p2,
        t2.id as team2_id,
        t2.player1_id as t2p1,
        t2.player2_id as t2p2,
        -- Calculate winner based on scores
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
            THEN t1.id
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
            THEN NULL  -- This indicates a draw
            ELSE t2.id
        END as winner_team_id
    FROM matches m
    JOIN teams t1 ON t1.match_id = m.id
    JOIN teams t2 ON t2.match_id = m.id AND t2.id > t1.id
),
player_matches AS (
    -- Calculate individual match results
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
    JOIN match_results mr ON 
        p.id IN (mr.t1p1, mr.t1p2, mr.t2p1, mr.t2p2)
),
last_five_games AS (
    -- Get last 5 games for each player
    SELECT 
        player_id,
        json_agg(
            json_build_object(
                'type', result
            )
            ORDER BY match_date DESC
        ) FILTER (WHERE match_date IS NOT NULL) as last_games
    FROM (
        SELECT DISTINCT player_id, match_id, match_date, result
        FROM player_matches
    ) pm
    GROUP BY player_id
),
player_stats AS (
    -- Calculate detailed statistics
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
        -- Enhanced score calculation
        (
            -- Base points from wins (100 points each)
            COUNT(DISTINCT CASE WHEN pm.result = 'win' THEN pm.match_id END) * 100
        ) + (
            -- Points from win rate (0-50 points)
            ROUND(
                COALESCE(
                    COUNT(DISTINCT CASE WHEN pm.result = 'win' THEN pm.match_id END)::numeric / 
                    NULLIF(COUNT(DISTINCT pm.match_id), 0) * 50,
                    0
                ),
                2
            )
        ) + (
            -- Activity bonus (1 point per match, max 50)
            LEAST(COUNT(DISTINCT pm.match_id), 50)
        ) + (
            -- Draw points (50 points each)
            COUNT(DISTINCT CASE WHEN pm.result = 'draw' THEN pm.match_id END) * 50
        ) as score
    FROM players p
    LEFT JOIN player_matches pm ON p.id = pm.player_id
    GROUP BY p.id, p.username, p.avatar_url
)
SELECT 
    ps.id,
    ps.username,
    ps.avatar_url,
    ps.matches_played,
    ps.wins,
    ps.losses,
    ps.draws,
    ps.win_rate,
    ps.score,
    COALESCE(
        (SELECT json_agg(elem) FROM (
            SELECT elem FROM json_array_elements(lfg.last_games) WITH ORDINALITY arr(elem, ord)
            WHERE ord <= 5
        ) sub),
        '[]'::json
    ) as last_games,
    DENSE_RANK() OVER (
        ORDER BY 
            ps.score DESC,                -- Primary: Overall score
            ps.matches_played DESC,        -- Secondary: Activity level
            ps.win_rate DESC,             -- Tertiary: Win rate
            ps.id                         -- Final tiebreaker: Player ID
    ) as rank
FROM player_stats ps
LEFT JOIN last_five_games lfg ON ps.id = lfg.player_id
ORDER BY rank, ps.score DESC, ps.matches_played DESC;