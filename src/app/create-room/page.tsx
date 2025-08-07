"use client";

import { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";

interface Player {
  id: number;
  name: string;
  isHost: boolean;
}

export default function CreateRoomPage() {
  const [roomCode, setRoomCode] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [totalRounds, setTotalRounds] = useState(5);
  const [gameMode, setGameMode] = useState("classic");
  const [diceType, setDiceType] = useState("6-sided");
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: "Host", isHost: true },
  ]);
  const [hostName, setHostName] = useState("");
  const [showRoomInfo, setShowRoomInfo] = useState(false);

  const generateRoomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setRoomCode(code);
    setShowRoomInfo(true);
  };

  const addPlayer = () => {
    if (players.length < 6) {
      setPlayers([
        ...players,
        {
          id: Date.now(),
          name: `Player ${players.length + 1}`,
          isHost: false,
        },
      ]);
    }
  };

  const removePlayer = (id: number) => {
    if (id !== 1) {
      setPlayers(players.filter((player) => player.id !== id));
    }
  };

  const updatePlayerName = (id: number, name: string) => {
    setPlayers(
      players.map((player) =>
        player.id === id ? { ...player, name } : player,
      ),
    );
  };

  const startGame = () => {
    if (!hostName.trim()) {
      alert("Please enter your name to start the game!");
      return;
    }
    if (players.length < 2) {
      alert("You need at least 2 players to start the game!");
      return;
    }
    setGameStarted(true);
    void confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    alert("Room code copied to clipboard!");
  };

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
        <Link href="/" className="mb-8 text-blue-300 hover:text-blue-200">
          ← Back to Home
        </Link>

        <h1 className="mb-8 text-4xl font-bold text-white">
          🎲 Create Private Room
        </h1>

        {!gameStarted ? (
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-2xl font-bold text-white">Room Setup</h2>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-white">Your Name:</label>
                <input
                  type="text"
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white placeholder-gray-400"
                />
              </div>

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
            </div>

            {!showRoomInfo ? (
              <button
                onClick={generateRoomCode}
                className="rounded-lg bg-green-600 px-8 py-3 text-white hover:bg-green-700"
              >
                Generate Room Code
              </button>
            ) : (
              <div className="space-y-6">
                <div className="rounded-lg bg-gradient-to-br from-green-900 to-blue-900 p-6">
                  <h3 className="mb-4 text-xl font-bold text-white">
                    Room Created!
                  </h3>
                  <div className="mb-4">
                    <p className="text-gray-300">
                      Share this code with your friends:
                    </p>
                    <div className="mt-2 flex items-center justify-center space-x-2">
                      <span className="text-3xl font-bold text-green-300">
                        {roomCode}
                      </span>
                      <button
                        onClick={copyRoomCode}
                        className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">
                    Game Settings: {totalRounds} rounds, {gameMode} mode,{" "}
                    {diceType} dice
                  </p>
                </div>

                <div className="rounded-lg bg-white/10 p-4">
                  <h3 className="mb-4 text-lg font-bold text-white">
                    Players ({players.length}/6)
                  </h3>
                  <div className="space-y-2">
                    {players.map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between rounded bg-white/5 p-2"
                      >
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-sm ${player.isHost ? "text-green-300" : "text-white"}`}
                          >
                            {player.isHost ? "👑" : "👤"}
                          </span>
                          <input
                            type="text"
                            value={player.name}
                            onChange={(e) =>
                              updatePlayerName(player.id, e.target.value)
                            }
                            className="rounded border border-gray-600 bg-gray-700 px-2 py-1 text-white"
                            placeholder="Player name"
                          />
                        </div>
                        {!player.isHost && (
                          <button
                            onClick={() => removePlayer(player.id)}
                            className="rounded bg-red-600 px-2 py-1 text-sm text-white hover:bg-red-700"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {players.length < 6 && (
                    <button
                      onClick={addPlayer}
                      className="mt-2 rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                    >
                      Add Player
                    </button>
                  )}
                </div>

                <button
                  onClick={startGame}
                  disabled={players.length < 2 || !hostName.trim()}
                  className="rounded-lg bg-green-600 px-8 py-3 text-white hover:bg-green-700 disabled:opacity-50"
                >
                  Start Game
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-8 rounded-lg bg-gradient-to-br from-green-900 to-blue-900 p-8">
              <h2 className="mb-4 text-3xl font-bold text-white">
                🎉 Game Started!
              </h2>
              <p className="mb-4 text-xl text-green-300">
                Room Code: {roomCode}
              </p>
              <p className="text-gray-300">
                Waiting for players to join... ({players.length}/6 players)
              </p>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {players.map((player) => (
                <div
                  key={player.id}
                  className={`rounded-lg p-4 ${
                    player.isHost
                      ? "border-2 border-green-400 bg-green-400/20"
                      : "bg-white/10"
                  }`}
                >
                  <div className="text-center">
                    <div className="mb-2 text-2xl">
                      {player.isHost ? "👑" : "👤"}
                    </div>
                    <h3
                      className={`text-lg font-bold ${
                        player.isHost ? "text-green-300" : "text-white"
                      }`}
                    >
                      {player.name}
                    </h3>
                    {player.isHost && (
                      <p className="text-sm text-green-300">Host</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <p className="text-gray-300">
                Game Settings: {totalRounds} rounds, {gameMode} mode, {diceType}{" "}
                dice
              </p>
              <button
                onClick={() => setGameStarted(false)}
                className="rounded-lg bg-gray-600 px-6 py-2 text-white hover:bg-gray-700"
              >
                Back to Setup
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
