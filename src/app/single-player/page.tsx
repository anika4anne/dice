"use client";

import { useState } from "react";
import Link from "next/link";

export default function SinglePlayerPage() {
  const [playerDice, setPlayerDice] = useState([1, 1, 1, 1, 1]);
  const [robotDice, setRobotDice] = useState([1, 1, 1, 1, 1]);
  const [playerScore, setPlayerScore] = useState(0);
  const [robotScore, setRobotScore] = useState(0);
  const [winner, setWinner] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [totalRounds, setTotalRounds] = useState(5);
  const [currentRound, setCurrentRound] = useState(0);
  const [playerWins, setPlayerWins] = useState(0);
  const [robotWins, setRobotWins] = useState(0);

  const startGame = () => {
    setGameStarted(true);
    setCurrentRound(0);
    setPlayerWins(0);
    setRobotWins(0);
    setWinner("");
  };

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

    let roundWinner = "";
    if (playerTotal > robotTotal) {
      roundWinner = "You win this round!";
      setPlayerWins(playerWins + 1);
    } else if (robotTotal > playerTotal) {
      roundWinner = "Robot wins this round!";
      setRobotWins(robotWins + 1);
    } else {
      roundWinner = "It's a tie!";
    }

    setWinner(roundWinner);
    setCurrentRound(currentRound + 1);

    if (currentRound + 1 >= totalRounds) {
      const gameWinner =
        playerWins + (playerTotal > robotTotal ? 1 : 0) >
        robotWins + (robotTotal > playerTotal ? 1 : 0)
          ? "You win the game!"
          : "Robot wins the game!";
      setWinner(`${roundWinner} ${gameWinner}`);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setCurrentRound(0);
    setPlayerWins(0);
    setRobotWins(0);
    setWinner("");
    setPlayerScore(0);
    setRobotScore(0);
  };

  return (
    <main className="min-h-screen bg-pink-900">
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <Link href="/" className="mb-8 text-blue-300 hover:text-blue-200">
          ← Back to Home
        </Link>

        <h1 className="mb-8 text-4xl font-bold text-white">Dice Game</h1>

        {!gameStarted ? (
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-2xl font-bold text-white">Settings</h2>
            <div className="mb-6">
              <label className="mb-2 block text-white">Number of Rounds:</label>
              <select
                value={totalRounds}
                onChange={(e) => setTotalRounds(Number(e.target.value))}
                className="rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white"
              >
                <option value={3}>3 Rounds</option>
                <option value={5}>5 Rounds</option>
                <option value={7}>7 Rounds</option>
                <option value={10}>10 Rounds</option>
              </select>
            </div>
            <button
              onClick={startGame}
              className="rounded-lg bg-green-600 px-8 py-3 text-white hover:bg-green-700"
            >
              Start Game
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 text-center">
              <p className="text-white">
                Round {currentRound + 1} of {totalRounds}
              </p>
              <p className="text-white">
                Wins: You {playerWins} - Robot {robotWins}
              </p>
            </div>

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

            <div className="flex gap-4">
              {currentRound < totalRounds && (
                <button
                  onClick={rollDice}
                  className="rounded-lg bg-blue-600 px-8 py-3 text-white hover:bg-blue-700"
                >
                  Roll Dice
                </button>
              )}
              <button
                onClick={resetGame}
                className="rounded-lg bg-gray-600 px-8 py-3 text-white hover:bg-gray-700"
              >
                New Game
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
