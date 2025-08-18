"use client";

import { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";

interface Player {
  id: number;
  name: string;
  dice: number[];
  score: number;
  wins: number;
  isCurrentTurn: boolean;
}

export default function MultiplayerPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [totalRounds, setTotalRounds] = useState(5);
  const [currentRound, setCurrentRound] = useState(0);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [gameMode, setGameMode] = useState("classic");
  const [diceType, setDiceType] = useState("6-sided");
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [finalResults, setFinalResults] = useState<
    Array<{ name: string; wins: number; score: number; isWinner: boolean }>
  >([]);
  const [roundResults, setRoundResults] = useState<
    Array<{ name: string; score: number }>
  >([]);
  const [roundWinner, setRoundWinner] = useState("");

  const getDiceMax = () => {
    const maxMap = {
      "4-sided": 4,
      "6-sided": 6,
      "8-sided": 8,
      "10-sided": 10,
      "12-sided": 12,
      "20-sided": 20,
    };
    return maxMap[diceType as keyof typeof maxMap] || 6;
  };

  const calculateScore = (dice: number[]) => {
    const max = getDiceMax();
    const scoreMap = {
      sum: () => dice.reduce((sum, value) => sum + value, 0),
      multiply: () => dice.reduce((product, value) => product * value, 1),
      highest: () => Math.max(...dice),
      lowest: () => Math.min(...dice),
      pairs: () => {
        const counts = new Array(max + 1).fill(0);
        dice.forEach((value) => counts[value]++);
        return counts.filter((count) => count >= 2).length * 10;
      },
    };
    return (
      scoreMap[gameMode as keyof typeof scoreMap]?.() ||
      dice.reduce((sum, value) => sum + value, 0)
    );
  };

  const addPlayer = () => {
    if (players.length < 6) {
      let playerNumber = players.length + 1;
      let playerName = `Player ${playerNumber}`;

      while (
        players.some((p) => p.name.toLowerCase() === playerName.toLowerCase())
      ) {
        playerNumber++;
        playerName = `Player ${playerNumber}`;
      }

      setPlayers([
        ...players,
        {
          id: Date.now(),
          name: playerName,
          dice: [1, 1, 1, 1, 1],
          score: 0,
          wins: 0,
          isCurrentTurn: false,
        },
      ]);
    }
  };

  const startGame = () => {
    if (players.length < 2) return alert("You need at least 2 players!");

    setPlayers(
      players.map((player, index) => ({
        ...player,
        dice: [1, 1, 1, 1, 1],
        score: 0,
        wins: 0,
        isCurrentTurn: index === 0,
      })),
    );
    setGameStarted(true);
    setCurrentRound(0);
    setCurrentPlayerIndex(0);
    setRoundResults([]);
    setRoundWinner("");
    setShowLeaderboard(false);
  };

  const rollDice = () => {
    setIsRolling(true);
    const interval = setInterval(() => {
      setPlayers((prev) =>
        prev.map((player, index) =>
          index === currentPlayerIndex
            ? {
                ...player,
                dice: player.dice.map(
                  () => Math.floor(Math.random() * getDiceMax()) + 1,
                ),
              }
            : player,
        ),
      );
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setIsRolling(false);
      finishRoll();
    }, 1000);
  };

  const finishRoll = () => {
    const currentPlayer = players[currentPlayerIndex];
    if (!currentPlayer) return;

    const score = calculateScore(currentPlayer.dice);

    const updatedPlayers = players.map((player, index) =>
      index === currentPlayerIndex ? { ...player, score } : player,
    );
    setPlayers(updatedPlayers);
    setRoundResults([...roundResults, { name: currentPlayer.name, score }]);

    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setPlayers(
        updatedPlayers.map((player, index) => ({
          ...player,
          isCurrentTurn: index === currentPlayerIndex + 1,
        })),
      );
    } else {
      endRound();
    }
  };

  const endRound = () => {
    const roundWinner = roundResults.reduce((prev, current) =>
      current.score > prev.score ? current : prev,
    );

    setRoundWinner(
      `${roundWinner.name} wins this round with ${roundWinner.score}!`,
    );
    setPlayers(
      players.map((player) =>
        player.name === roundWinner.name
          ? { ...player, wins: player.wins + 1 }
          : player,
      ),
    );
    setCurrentRound((prev) => prev + 1);

    if (currentRound + 1 >= totalRounds) {
      endGame();
    } else {
      setTimeout(() => {
        setCurrentPlayerIndex(0);
        setRoundResults([]);
        setRoundWinner("");
        setPlayers(
          players.map((player, index) => ({
            ...player,
            isCurrentTurn: index === 0,
          })),
        );
      }, 2000);
    }
  };

  const endGame = () => {
    const sortedPlayers = [...players].sort((a, b) => b.wins - a.wins);
    const results = sortedPlayers.map((player, index) => ({
      name: player.name,
      wins: player.wins,
      score: player.score,
      isWinner: index === 0,
    }));
    setFinalResults(results);
    setShowLeaderboard(true);
    void confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  const resetGame = () => {
    setGameStarted(false);
    setCurrentRound(0);
    setCurrentPlayerIndex(0);
    setRoundResults([]);
    setRoundWinner("");
    setShowLeaderboard(false);
    setPlayers(
      players.map((player) => ({
        ...player,
        dice: [1, 1, 1, 1, 1],
        score: 0,
        wins: 0,
        isCurrentTurn: false,
      })),
    );
  };

  const getScoreDescription = (score: number) => {
    const descriptions = {
      sum: "Sum",
      multiply: "Product",
      highest: "Highest",
      lowest: "Lowest",
      pairs: "Pairs",
    };
    return `${descriptions[gameMode as keyof typeof descriptions] || "Score"}: ${score}`;
  };

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundImage: "url('/bg.avif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 rounded-lg bg-blue-900 px-6 py-3 text-white"
        >
          <span className="font-semibold">← Back to Home</span>
        </Link>
        <h1 className="mb-8 text-4xl font-bold text-white">
          Multiplayer Dice Game
        </h1>

        {!gameStarted ? (
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-2xl font-bold text-white">Game Setup</h2>
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
                  {[3, 5, 7, 10].map((rounds) => (
                    <option key={rounds} value={rounds}>
                      {rounds} Rounds
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-white">Game Mode:</label>
                <select
                  value={gameMode}
                  onChange={(e) => setGameMode(e.target.value)}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white"
                >
                  {["classic", "multiply", "highest", "lowest", "pairs"].map(
                    (mode) => (
                      <option key={mode} value={mode}>
                        {mode === "classic"
                          ? "Classic (Sum)"
                          : mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </option>
                    ),
                  )}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-white">Dice Type:</label>
                <select
                  value={diceType}
                  onChange={(e) => setDiceType(e.target.value)}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white"
                >
                  {[
                    "4-sided",
                    "6-sided",
                    "8-sided",
                    "10-sided",
                    "12-sided",
                    "20-sided",
                  ].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-white">
                  Players ({players.length}/6):
                </label>
                <button
                  onClick={addPlayer}
                  disabled={players.length >= 6}
                  className="w-full rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                >
                  Add Player
                </button>
              </div>
            </div>

            <div className="mb-6 max-h-64 overflow-y-auto rounded-lg bg-white/10 p-4">
              <h3 className="mb-4 text-lg font-bold text-white">Players</h3>
              {players.length === 0 ? (
                <p className="text-gray-300">
                  No players added yet. Add at least 2 players to start!
                </p>
              ) : (
                <div className="space-y-2">
                  {players.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between rounded bg-white/5 p-2"
                    >
                      <input
                        type="text"
                        value={player.name}
                        onChange={(e) => {
                          const newName = e.target.value.trim();
                          const isDuplicate = players.some(
                            (p) =>
                              p.id !== player.id &&
                              p.name.toLowerCase() === newName.toLowerCase(),
                          );
                          if (!isDuplicate || newName === "") {
                            setPlayers(
                              players.map((p) =>
                                p.id === player.id
                                  ? { ...p, name: newName }
                                  : p,
                              ),
                            );
                          }
                        }}
                        className="flex-1 rounded border border-gray-600 bg-gray-700 px-2 py-1 text-white"
                        placeholder="Enter name"
                      />
                      <button
                        onClick={() =>
                          setPlayers(players.filter((p) => p.id !== player.id))
                        }
                        className="ml-2 rounded bg-red-600 px-2 py-1 text-white hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={startGame}
              disabled={players.length < 2}
              className="rounded-lg bg-green-600 px-8 py-3 text-white hover:bg-green-700 disabled:opacity-50"
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
              <p className="text-sm text-gray-300">
                Mode: {gameMode} | Dice: {diceType}
              </p>
            </div>

            <div className="mb-6 text-center">
              <p className="text-xl text-white">
                Current Turn:{" "}
                <span className="font-bold text-yellow-300">
                  {players[currentPlayerIndex]?.name}
                </span>
              </p>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {players.map((player, index) => (
                <div
                  key={player.id}
                  className={`rounded-lg p-4 ${player.isCurrentTurn ? "border-2 border-yellow-400 bg-yellow-400/20" : "bg-white/10"}`}
                >
                  <div className="text-center">
                    <h3
                      className={`mb-2 text-lg font-bold ${player.isCurrentTurn ? "text-yellow-300" : "text-white"}`}
                    >
                      {player.name}
                    </h3>
                    <p className="mb-2 text-sm text-gray-300">
                      Wins: {player.wins} | {getScoreDescription(player.score)}
                    </p>
                    <div
                      className={`grid grid-cols-5 gap-1 ${player.isCurrentTurn && isRolling ? "animate-pulse" : ""}`}
                    >
                      {player.dice.map((value, diceIndex) => (
                        <div
                          key={diceIndex}
                          className="h-8 w-8 rounded bg-white text-center text-sm leading-8 font-bold text-gray-800 shadow"
                        >
                          {value}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {roundResults.length > 0 && (
              <div className="mb-6 rounded-lg bg-white/10 p-4">
                <h3 className="mb-2 text-lg font-bold text-white">
                  Round Results:
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {roundResults.map((result, _index) => (
                    <div key={_index} className="flex justify-between">
                      <span className="text-gray-300">{result.name}:</span>
                      <span className="font-bold text-white">
                        {result.score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {roundWinner && (
              <div className="mb-6 text-center">
                <p className="text-2xl font-bold text-yellow-300">
                  {roundWinner}
                </p>
              </div>
            )}

            {!isRolling && players[currentPlayerIndex] && (
              <button
                onClick={rollDice}
                className="rounded-lg bg-blue-600 px-8 py-3 text-white hover:bg-blue-700"
              >
                Roll Dice
              </button>
            )}
          </>
        )}

        {showLeaderboard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-2xl bg-gradient-to-br from-teal-900 to-emerald-700 p-8 shadow-2xl">
              <h2 className="mb-6 text-center text-3xl font-bold text-white">
                🏆 Game Results 🏆
              </h2>
              <div className="mb-6 space-y-4">
                {finalResults.map((player, index) => (
                  <div
                    key={player.name}
                    className={`flex items-center justify-between rounded-lg p-4 ${player.isWinner ? "border-2 border-yellow-400 bg-gradient-to-r from-yellow-400/20 to-orange-400/20" : "bg-white/10"}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`text-2xl ${player.isWinner ? "text-yellow-400" : "text-gray-400"}`}
                      >
                        {index === 0
                          ? "🥇"
                          : index === 1
                            ? "🥈"
                            : index === 2
                              ? "🥉"
                              : `${index + 1}.`}
                      </div>
                      <div>
                        <div
                          className={`font-bold ${player.isWinner ? "text-yellow-300" : "text-white"}`}
                        >
                          {player.name}
                        </div>
                        <div className="text-sm text-gray-300">
                          {player.wins} wins
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">
                        {player.score}
                      </div>
                      <div className="text-xs text-gray-400">Final Score</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={resetGame}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-white transition-colors hover:bg-blue-700"
                >
                  Play Again
                </button>
                <Link
                  href="/"
                  className="flex-1 rounded-lg bg-gray-600 px-4 py-3 text-center text-white transition-colors hover:bg-gray-700"
                >
                  Main Menu
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
