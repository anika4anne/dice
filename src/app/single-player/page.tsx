"use client";

import { useState } from "react";
import Link from "next/link";

export default function SinglePlayerPage() {
  const [dice, setDice] = useState([1, 1, 1, 1, 1]);
  const [score, setScore] = useState(0);

  const rollDice = () => {
    const newDice = dice.map(() => Math.floor(Math.random() * 6) + 1);
    setDice(newDice);
    setScore(newDice.reduce((sum, value) => sum + value, 0));
  };

  return (
    <main className="min-h-screen bg-pink-900">
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <Link href="/" className="mb-8 text-blue-300 hover:text-blue-200">
          ← Back to Home
        </Link>

        <h1 className="mb-8 text-4xl font-bold text-white">Dice Game</h1>

        <div className="mb-8 text-center">
          <p className="text-2xl text-white">Score: {score}</p>
        </div>

        <div className="mb-8 grid grid-cols-5 gap-4">
          {dice.map((value, index) => (
            <div
              key={index}
              className="h-16 w-16 rounded-lg bg-white text-center text-2xl leading-[4rem] font-bold text-gray-800"
            >
              {value}
            </div>
          ))}
        </div>

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
