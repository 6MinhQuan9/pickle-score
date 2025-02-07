"use client";

import { useEffect, useRef } from "react";

const LoadingScreen = () => {
  const player1Ref = useRef<HTMLDivElement>(null);
  const player2Ref = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePlayerPositions = () => {
      if (player1Ref.current && player2Ref.current && ballRef.current) {
        const player1X = Math.random() * 20 + 10; // 10% to 30%
        const player1Y = Math.random() * 60 + 20; // 20% to 80%
        const player2X = Math.random() * 20 + 70; // 70% to 90%
        const player2Y = Math.random() * 60 + 20; // 20% to 80%

        player1Ref.current.style.setProperty("--x", `${player1X}%`);
        player1Ref.current.style.setProperty("--y", `${player1Y}%`);
        player2Ref.current.style.setProperty("--x", `${player2X}%`);
        player2Ref.current.style.setProperty("--y", `${player2Y}%`);

        ballRef.current.style.setProperty("--player1X", `${player1X}%`);
        ballRef.current.style.setProperty("--player1Y", `${player1Y}%`);
        ballRef.current.style.setProperty("--player2X", `${player2X}%`);
        ballRef.current.style.setProperty("--player2Y", `${player2Y}%`);
      }
    };

    updatePlayerPositions(); // Initial positions
    const interval = setInterval(updatePlayerPositions, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8 text-green-800">
          Loading Pickleball Game...
        </h1>
        <div className="relative w-80 h-48 bg-green-500 rounded-lg overflow-hidden">
          {/* Pickleball court */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-72 h-40 border-2 border-white rounded"></div>
            <div className="absolute w-0.5 h-40 bg-white"></div>
          </div>

          {/* Player 1 */}
          <div
            ref={player1Ref}
            className="absolute w-8 h-12 transition-all duration-1000 ease-in-out"
            style={{
              left: "var(--x)",
              top: "var(--y)",
              transform: "translate(-50%, -50%)",
            }}
          >
            <svg
              className="w-full h-full text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* Player 2 */}
          <div
            ref={player2Ref}
            className="absolute w-8 h-12 transition-all duration-1000 ease-in-out"
            style={{
              left: "var(--x)",
              top: "var(--y)",
              transform: "translate(-50%, -50%)",
            }}
          >
            <svg
              className="w-full h-full text-red-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* Pickleball */}
          <div
            ref={ballRef}
            className="absolute w-3 h-3 bg-yellow-400 rounded-full animate-pickleball"
          ></div>
        </div>
        <p className="mt-4 text-green-700">Get ready to play!</p>
      </div>
      <style jsx>{`
        @keyframes pickleball-game {
          0%,
          100% {
            left: var(--player1X);
            top: var(--player1Y);
          }
          25%,
          75% {
            left: 50%;
            top: 50%;
          }
          50% {
            left: var(--player2X);
            top: var(--player2Y);
          }
        }
        .animate-pickleball {
          animation: pickleball-game 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
