"use client";

import { useState } from "react";
import Link from "next/link";

export default function SinglePlayerPage() {
  const [playerDice, setPlayerDice] = useState([1, 1, 1, 1, 1]);
  const [robotDice, setRobotDice] = useState([1, 1, 1, 1, 1]);
  const [playerScore, setPlayerScore] = useState(0);
  const [robotScore, setRobotScore] = useState(0);
  const [winner, setWinner] = useState("");

  const rollDice = () => {
    const newPlayerDice = playerDice.map(
      () => Math.floor(Math.random() * 6) + 1,
    );
    const newRobotDice = robotDice.map(() => Math.floor(Math.random() * 6) + 1);

    const playerTotal = newPlayerDice.reduce((sum, value) => sum + value, 0);
    const robotTotal = newRobotDice.reduce((sum, value) => sum + value, 0);

    setPlayerDice(newPlayerDice);
    setRobotDice(newRobotDice);
    setPlayerScore(playerTotal);
    setRobotScore(robotTotal);

    if (playerTotal > robotTotal) {
      setWinner("You win!");
    } else if (robotTotal > playerTotal) {
      setWinner("Robot wins!");
    } else {
      setWinner("It's a tie!");
    }
  };

  return (
    <main className="min-h-screen bg-pink-900">
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <Link href="/" className="mb-8 text-blue-300 hover:text-blue-200">
          ← Back to Home
        </Link>

        <h1 className="mb-8 text-4xl font-bold text-white">Dice Game</h1>

        <div className="mb-8 grid grid-cols-2 gap-16">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold text-blue-400">You</h2>
            <p className="mb-4 text-xl text-white">Score: {playerScore}</p>
            <div className="grid grid-cols-5 gap-2">
              {playerDice.map((value, index) => (
                <div
                  key={index}
                  className="h-12 w-12 rounded-lg bg-white text-center text-lg leading-[3rem] font-bold text-gray-800"
                >
                  {value}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold text-red-400">Robot</h2>
            <p className="mb-4 text-xl text-white">Score: {robotScore}</p>
            <div className="grid grid-cols-5 gap-2">
              {robotDice.map((value, index) => (
                <div
                  key={index}
                  className="h-12 w-12 rounded-lg bg-white text-center text-lg leading-[3rem] font-bold text-gray-800"
                >
                  {value}
                </div>
              ))}
            </div>
          </div>
        </div>

        {winner && (
          <div className="mb-8 text-center">
            <p className="text-2xl font-bold text-yellow-300">{winner}</p>
          </div>
        )}

        <button
          onClick={rollDice}
          className="rounded-lg bg-blue-600 px-8 py-3 text-white hover:bg-blue-700"
        >
          Roll Dice
        </button>
      </div>
    </main>
  );
}
