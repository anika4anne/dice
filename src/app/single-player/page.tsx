"use client";

import { useState, useEffect } from "react";
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
  const [isRolling, setIsRolling] = useState(false);
  const [gameMode, setGameMode] = useState("classic");
  const [diceType, setDiceType] = useState("6-sided");
  const [stats, setStats] = useState({
    totalGames: 0,
    playerWins: 0,
    robotWins: 0,
    highestScore: 0,
    averageScore: 0,
  });

  useEffect(() => {
    if (isRolling) {
      const interval = setInterval(() => {
        setPlayerDice((prev) =>
          prev.map(() => Math.floor(Math.random() * 6) + 1),
        );
        setRobotDice((prev) =>
          prev.map(() => Math.floor(Math.random() * 6) + 1),
        );
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        setIsRolling(false);
        finishRoll();
      }, 1000);
    }
  }, [isRolling]);

  const getDiceMax = () => {
    switch (diceType) {
      case "4-sided":
        return 4;
      case "8-sided":
        return 8;
      case "10-sided":
        return 10;
      case "12-sided":
        return 12;
      case "20-sided":
        return 20;
      default:
        return 6;
    }
  };

  const calculateScore = (dice: number[]) => {
    const max = getDiceMax();

    switch (gameMode) {
      case "sum":
        return dice.reduce((sum, value) => sum + value, 0);
      case "multiply":
        return dice.reduce((product, value) => product * value, 1);
      case "highest":
        return Math.max(...dice);
      case "lowest":
        return Math.min(...dice);
      case "pairs":
        const counts = new Array(max + 1).fill(0);
        dice.forEach((value) => counts[value]++);
        const pairs = counts.filter((count) => count >= 2).length;
        return pairs * 10;
      default:
        return dice.reduce((sum, value) => sum + value, 0);
    }
  };

  const finishRoll = () => {
    const playerTotal = calculateScore(playerDice);
    const robotTotal = calculateScore(robotDice);

    setPlayerScore(playerTotal);
    setRobotScore(robotTotal);

    let roundWinner = "";
    if (playerTotal > robotTotal) {
      roundWinner = "You win this round!";
      setPlayerWins((prev) => prev + 1);
    } else if (robotTotal > playerTotal) {
      roundWinner = "Robot wins this round!";
      setRobotWins((prev) => prev + 1);
    } else {
      roundWinner = "It's a tie!";
    }

    setWinner(roundWinner);
    setCurrentRound((prev) => prev + 1);

    const newHighestScore = Math.max(
      playerTotal,
      robotTotal,
      stats.highestScore,
    );
    setStats((prev) => ({
      ...prev,
      highestScore: newHighestScore,
    }));

    if (currentRound + 1 >= totalRounds) {
      const finalPlayerWins = playerWins + (playerTotal > robotTotal ? 1 : 0);
      const finalRobotWins = robotWins + (robotTotal > playerTotal ? 1 : 0);

      const gameWinner =
        finalPlayerWins > finalRobotWins
          ? "You win the game!"
          : "Robot wins the game!";

      setWinner(`${roundWinner} ${gameWinner}`);

      setStats((prev) => ({
        totalGames: prev.totalGames + 1,
        playerWins:
          prev.playerWins + (finalPlayerWins > finalRobotWins ? 1 : 0),
        robotWins: prev.robotWins + (finalRobotWins > finalPlayerWins ? 1 : 0),
        highestScore: newHighestScore,
        averageScore: Math.round(
          (prev.averageScore * prev.totalGames + playerTotal + robotTotal) /
            (prev.totalGames + 1),
        ),
      }));
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setCurrentRound(0);
    setPlayerWins(0);
    setRobotWins(0);
    setWinner("");
    setPlayerScore(0);
    setRobotScore(0);
  };

  const rollDice = () => {
    setIsRolling(true);
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

  const getScoreDescription = (score: number) => {
    if (gameMode === "sum") return `Sum: ${score}`;
    if (gameMode === "multiply") return `Product: ${score}`;
    if (gameMode === "highest") return `Highest: ${score}`;
    if (gameMode === "lowest") return `Lowest: ${score}`;
    if (gameMode === "pairs") return `Pairs: ${score}`;
    return `Score: ${score}`;
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

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-white">
                  Number of Rounds:
                </label>
                <select
                  value={totalRounds}
                  onChange={(e) => setTotalRounds(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white"
                >
                  <option value={3}>3 Rounds</option>
                  <option value={5}>5 Rounds</option>
                  <option value={7}>7 Rounds</option>
                  <option value={10}>10 Rounds</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-white">Game Mode:</label>
                <select
                  value={gameMode}
                  onChange={(e) => setGameMode(e.target.value)}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white"
                >
                  <option value="classic">Classic (Sum)</option>
                  <option value="multiply">Multiply</option>
                  <option value="highest">Highest Die</option>
                  <option value="lowest">Lowest Die</option>
                  <option value="pairs">Count Pairs</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-white">Dice Type:</label>
                <select
                  value={diceType}
                  onChange={(e) => setDiceType(e.target.value)}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white"
                >
                  <option value="4-sided">4-sided</option>
                  <option value="6-sided">6-sided</option>
                  <option value="8-sided">8-sided</option>
                  <option value="10-sided">10-sided</option>
                  <option value="12-sided">12-sided</option>
                  <option value="20-sided">20-sided</option>
                </select>
              </div>
            </div>

            <button
              onClick={startGame}
              className="rounded-lg bg-green-600 px-8 py-3 text-white hover:bg-green-700"
            >
              Start Game
            </button>

            <div className="mt-8 rounded-lg bg-white/10 p-4">
              <h3 className="mb-2 text-lg font-bold text-white">Statistics</h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                <div>Total Games: {stats.totalGames}</div>
                <div>Your Wins: {stats.playerWins}</div>
                <div>Robot Wins: {stats.robotWins}</div>
                <div>Highest Score: {stats.highestScore}</div>
              </div>
            </div>
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
              <p className="text-sm text-gray-300">
                Mode: {gameMode} | Dice: {diceType}
              </p>
            </div>

            <div className="mb-8 grid grid-cols-2 gap-16">
              <div className="text-center">
                <h2 className="mb-4 text-2xl font-bold text-blue-400">You</h2>
                <p className="mb-4 text-xl text-white">
                  {getScoreDescription(playerScore)}
                </p>
                <div
                  className={`grid grid-cols-5 gap-2 ${isRolling ? "animate-pulse" : ""}`}
                >
                  {playerDice.map((value, index) => (
                    <div
                      key={index}
                      className="h-12 w-12 rounded-lg bg-white text-center text-lg leading-[3rem] font-bold text-gray-800 shadow-lg"
                    >
                      {value}
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <h2 className="mb-4 text-2xl font-bold text-red-400">Robot</h2>
                <p className="mb-4 text-xl text-white">
                  {getScoreDescription(robotScore)}
                </p>
                <div
                  className={`grid grid-cols-5 gap-2 ${isRolling ? "animate-pulse" : ""}`}
                >
                  {robotDice.map((value, index) => (
                    <div
                      key={index}
                      className="h-12 w-12 rounded-lg bg-white text-center text-lg leading-[3rem] font-bold text-gray-800 shadow-lg"
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
              {currentRound < totalRounds && !isRolling && (
                <button
                  onClick={rollDice}
                  className="rounded-lg bg-blue-600 px-8 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
                  disabled={isRolling}
                >
                  {isRolling ? "Rolling..." : "Roll Dice"}
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
