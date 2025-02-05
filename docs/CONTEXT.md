# Pickleball Score Tracker - App Flow & Features

This document provides a detailed explanation of the web app's flow and features for the Pickleball Score Tracker. The app is designed with a mobile-first approach to help you and your friends easily keep track of scores and match histories. Developers can use this as a blueprint to implement and enhance the app.

## Tech Stack:
Frontend: Next.js
Backend/Database: Supabase
UI Framework: Shadcn/UI

---

## Table of Contents

1. [Overview](#overview)
2. [Home Screen](#home-screen)
3. [User Authentication & Profile](#user-authentication--profile)
4. [Player Details & Rankings](#player-details--rankings)
5. [Match History & Details](#match-history--details)
6. [Admin Functionality](#admin-functionality)
7. [Mobile-first Design Considerations](#mobile-first-design-considerations)
8. [User Flow Summary](#user-flow-summary)

---

## Overview

The Pickleball Score Tracker app enables players to:
- View an overall rankings table.
- Browse a detailed match history.
- Access individual player and match details.
- Create an account to be included in the rankings.
- Allow admins to manage (create, edit, delete) match records.

This document outlines all necessary components to build a mobile-friendly web app with clear navigation and robust features.

---

## Home Screen

The **Home Screen** is the landing page and consists of two main sections:

### 1. Rankings Table (Top Section)
- **Display:**  
  - A table or list showing all registered players ranked by their performance (e.g., wins, losses, overall score).
- **Columns/Fields:**  
  - Rank, Player Name, Wins, Losses, Score, etc.
- **Interactions:**  
  - **Row Click:** Tapping on a player's row navigates to the **Player Details** page, showing more detailed stats and history for that player.

### 2. Match History (Bottom Section)
- **Display:**  
  - A list of match cards representing recent matches, ordered by date (most recent first).
- **Card Contents:**  
  - Date of the match, participating players/teams, final scores.
- **Interactions:**  
  - **Card Click:** Tapping on a match card navigates to the **Match Details** page, where full details of the match are provided.

---

## User Authentication & Profile

### Account Creation / Registration
- **Registration Page:**  
  - Fields: Username, Email, Password (and any additional optional fields such as profile picture).
  - Purpose: Allow users to sign up and have their statistics and match history included in the rankings.
  
### Login
- **Login Page:**  
  - Users can authenticate using their credentials.
  - Successful login will personalize the user experience (e.g., highlight the user's ranking, show personal match history).

### Profile Page
- **Information Displayed:**  
  - Personal details, overall performance statistics, and match history specific to the user.
- **Interactions:**  
  - Edit profile information.
  - View personal statistics and match trends.

---

## Player Details & Rankings

### Player Details Page
- **Display:**
  - Profile details (e.g., name, profile picture).
  - Detailed performance stats: wins, losses, total matches played, rating, etc.
  - Historical performance and recent match outcomes.
- **Interactions:**
  - Option to view all matches involving the player.
  - Back navigation to return to the rankings table or previous screen.

### Rankings Table Recap
- **Purpose:**  
  - Provides a snapshot of player standings.
- **Interactions:**  
  - Clicking on any row will route the user to that player's detailed profile.

---

## Match History & Details

### Match History Cards (On Home Screen)
- **Display:**
  - Each card summarizes a match (date, participating players, scores).
- **Interactions:**
  - Tapping a card opens the **Match Details** page.

### Match Details Page
- **Information Displayed:**  
  - Full details of the match: date, time, participating players/teams, scores, and additional match statistics if available.
- **Interactions:**  
  - **For Regular Users:** View detailed match information.
  - **For Admins:** Options to edit or delete the match record.
  - Navigation back to the match history list.

---

## Admin Functionality

### Admin Dashboard (Accessible Only to Admin Users)
- **Match Management:**
  - **Create Match:**  
    - A form to enter match details (date, players/teams involved, scores, etc.).
  - **Edit Match:**  
    - Ability to update match details.
  - **Delete Match:**  
    - Remove a match record from the system.
- **Additional Considerations:**  
  - Optionally, an admin dashboard might include user management features or additional analytics.
  
### Access Control
- **User Roles:**  
  - **Standard Users:** Can view and interact with the app (access rankings, match history, and personal profiles).
  - **Admin Users:** Have extended privileges to manage match records (create, edit, delete).

---

## Mobile-first Design Considerations

- **Responsive Design:**  
  - Ensure layouts are optimized for small screens with fluid grids and adaptable components.
- **Navigation:**  
  - Use a mobile-friendly navigation bar or hamburger menu for easy access to features (home, profile, etc.).
- **Touch Interactions:**  
  - Buttons, cards, and rows should have ample size and spacing for touch accuracy.
- **Performance:**  
  - Optimize load times and interactions to ensure smooth performance on mobile devices.
- **Visual Hierarchy:**  
  - Prioritize key information (rankings, recent matches) to be immediately visible on mobile screens.

---

## User Flow Summary

### For Unauthenticated Users
1. **Landing/Home Screen:**
   - Display the Rankings Table (top) and Match History (bottom).
   - Allow users to explore match and player details (read-only).
2. **Call-to-Action:**
   - Prompt to create an account for personalized features and to be included in the rankings.

### For Authenticated Users
1. **Home Screen:**
   - Same as unauthenticated view but with personal enhancements (e.g., highlighting the user's ranking).
2. **Navigation:**
   - Click on a player row to access the **Player Details** page.
   - Tap a match card to view **Match Details**.
3. **Profile Management:**
   - Access the profile page to view or edit personal details.
   
### For Admin Users
1. **Admin Controls:**
   - In addition to the standard flow, admins can:
     - Create new match entries.
     - Edit existing match records.
     - Delete match records.
2. **Access:**
   - Admin features should be clearly accessible (e.g., through a dedicated admin dashboard or within the match details page).

---

## Conclusion

This detailed guide outlines the app's flow and features for the Pickleball Score Tracker web app with a mobile-first design. It provides a clear structure for developers to implement:
- A dual-section home screen (Rankings and Match History).
- Detailed views for player and match information.
- User authentication and profile management.
- Admin capabilities for match management.

Developers should use this document as a reference to ensure a cohesive and intuitive user experience across all functionalities.

# Database Schema Design

## 1. Tables & Schema Design

### 1.1 Players Table
Stores information about players with an indexed UUID.

```sql
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT NOT NULL,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('Male', 'Female')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 1.2 Teams Table
A team is uniquely defined by two players, enforcing uniqueness.

```sql
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    player1_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    player2_id UUID REFERENCES players(id) ON DELETE CASCADE, -- NULL for singles
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_player_order CHECK (player2_id IS NULL OR player1_id < player2_id)
);
```

### 1.3 Matches Table
Tracks pickleball matches for both 1v1 (Singles) and 2v2 (Doubles).

```sql
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    match_type TEXT CHECK (match_type IN ('Singles', 'Doubles')) NOT NULL,
    match_date TIMESTAMPTZ DEFAULT NOW(),
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

### 1.4 Scores Table
Each match has multiple sets, so we track each set separately.

```sql
CREATE TABLE scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    set_number INT NOT NULL CHECK (set_number > 0),
    score INT NOT NULL CHECK (score >= 0),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_set_team UNIQUE (match_id, set_number, team_id)
);

```

### 1.5 Player Rankings View
Instead of storing rankings, we calculate them dynamically:

```sql
CREATE VIEW player_rankings AS
SELECT 
    players.id,
    players.first_name,
    players.last_name,
    COUNT(matches.winner_player_id) AS wins
FROM players
LEFT JOIN matches ON players.id = matches.winner_player_id
GROUP BY players.id
ORDER BY wins DESC;
```

### 1.6 Team Rankings View

```sql
CREATE VIEW team_rankings AS
SELECT 
    teams.id,
    p1.first_name AS player1,
    p2.first_name AS player2,
    COUNT(matches.winner_team_id) AS wins
FROM teams
LEFT JOIN matches ON teams.id = matches.winner_team_id
JOIN players p1 ON teams.player1_id = p1.id
JOIN players p2 ON teams.player2_id = p2.id
GROUP BY teams.id, p1.first_name, p2.first_name
ORDER BY wins DESC;
```

# Storage Design

## 1. Supabase Storage Buckets

### 1.1 Profile Pictures Bucket
