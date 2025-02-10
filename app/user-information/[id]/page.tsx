import PlayerCard from "../component/player-card";

const playerData = {
  id: "1",
  name: "ROGER FEDERER",
  position: "RIGHT-HANDED / ONE-HANDED BACKHAND",
  bio: "Roger Federer is a Swiss professional tennis player. He has been ranked world No. 1 by the ATP for 310 weeks and has finished as the year-end No. 1 five times. He has won 20 Grand Slam singles titles and has held the record for most Grand Slam men's singles championships.",
  dateOfBirth: "08/08/1981",
  placeOfBirth: "Basel, Switzerland",
  height: "1.85 m (6 ft 1 in)",
  image: "/sample.jfif",
  ranking: {
    current: 3,
    highest: 1,
  },
  stats: {
    serve: 95,
    forehand: 98,
    backhand: 90,
    volley: 95,
    movement: 92,
    mental: 95,
    fitness: 90,
  },
  skills: {
    firstServePercentage: 62,
    returnGamesWon: 27,
    breakPointsSaved: 65,
    winPercentage: 82,
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-black p-8">
      <PlayerCard player={playerData} />
    </main>
  );
}
