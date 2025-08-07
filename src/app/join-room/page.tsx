"use client";

import { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";

interface Player {
  id: number;
  name: string;
  isHost: boolean;
}

export default function JoinRoomPage() {
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [totalRounds, setTotalRounds] = useState(5);
  const [gameMode, setGameMode] = useState("classic");
  const [diceType, setDiceType] = useState("6-sided");
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: "Host", isHost: true },
    { id: 2, name: "Player 2", isHost: false },
  ]);

  const joinRoom = () => {
    if (!roomCode.trim()) {
      alert("Please enter a room code!");
      return;
    }
    if (!playerName.trim()) {
      alert("Please enter your name!");
      return;
    }
    if (roomCode.length !== 6) {
      alert("Room code must be 6 characters long!");
      return;
    }

    setIsJoining(true);

    // Simulate joining process
    setTimeout(() => {
      setIsJoining(false);
      setHasJoined(true);

      setPlayers([
        ...players,
        { id: Date.now(), name: playerName, isHost: false },
      ]);

      void confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    }, 1500);
  };

  const startGame = () => {
    setGameStarted(true);
    void confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
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
          🎲 Join Private Room
        </h1>

        {!hasJoined ? (
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-2xl font-bold text-white">Join a Game</h2>

            <div className="mb-6 space-y-4">
              <div>
                <label className="mb-2 block text-white">Room Code:</label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="Enter 6-character code"
                  maxLength={6}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-center text-2xl font-bold tracking-widest text-white placeholder-gray-400"
                />
                <p className="mt-1 text-sm text-gray-400">
                  Ask your friend for the room code
                </p>
              </div>

              <div>
                <label className="mb-2 block text-white">Your Name:</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white placeholder-gray-400"
                />
              </div>
            </div>

            <button
              onClick={joinRoom}
              disabled={!roomCode.trim() || !playerName.trim() || isJoining}
              className="rounded-lg bg-orange-600 px-8 py-3 text-white hover:bg-orange-700 disabled:opacity-50"
            >
              {isJoining ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Joining...</span>
                </div>
              ) : (
                "Join Room"
              )}
            </button>
          </div>
        ) : !gameStarted ? (
          <div className="mb-8 text-center">
            <div className="mb-6 rounded-lg bg-gradient-to-br from-orange-900 to-red-900 p-6">
              <h3 className="mb-4 text-xl font-bold text-white">
                🎉 Successfully Joined!
              </h3>
              <p className="mb-2 text-lg text-orange-300">
                Room Code: {roomCode}
              </p>
              <p className="text-gray-300">
                Welcome, {playerName}! Waiting for the host to start the game...
              </p>
            </div>

            <div className="mb-6 rounded-lg bg-white/10 p-4">
              <h3 className="mb-4 text-lg font-bold text-white">
                Players ({players.length}/6)
              </h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className={`flex items-center space-x-2 rounded p-2 ${
                      player.isHost
                        ? "border border-green-400 bg-green-400/20"
                        : "bg-white/5"
                    }`}
                  >
                    <span className="text-lg">
                      {player.isHost ? "👑" : "👤"}
                    </span>
                    <span
                      className={`font-medium ${
                        player.isHost ? "text-green-300" : "text-white"
                      }`}
                    >
                      {player.name}
                    </span>
                    {player.isHost && (
                      <span className="text-xs text-green-300">(Host)</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-white/10 p-4">
              <h3 className="mb-2 text-lg font-bold text-white">
                Game Settings
              </h3>
              <p className="text-gray-300">
                {totalRounds} rounds • {gameMode} mode • {diceType} dice
              </p>
            </div>

            <div className="mt-6 space-y-2">
              <p className="text-sm text-gray-400">
                Waiting for host to start the game...
              </p>
              <button
                onClick={() => setHasJoined(false)}
                className="rounded-lg bg-gray-600 px-6 py-2 text-white hover:bg-gray-700"
              >
                Leave Room
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-8 rounded-lg bg-gradient-to-br from-orange-900 to-red-900 p-8">
              <h2 className="mb-4 text-3xl font-bold text-white">
                🎉 Game Started!
              </h2>
              <p className="mb-4 text-xl text-orange-300">
                Room Code: {roomCode}
              </p>
              <p className="text-gray-300">
                Game is ready to begin! ({players.length}/6 players)
              </p>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {players.map((player) => (
                <div
                  key={player.id}
                  className={`rounded-lg p-4 ${
                    player.isHost
                      ? "border-2 border-green-400 bg-green-400/20"
                      : player.name === playerName
                        ? "border-2 border-orange-400 bg-orange-400/20"
                        : "bg-white/10"
                  }`}
                >
                  <div className="text-center">
                    <div className="mb-2 text-2xl">
                      {player.isHost ? "👑" : "👤"}
                    </div>
                    <h3
                      className={`text-lg font-bold ${
                        player.isHost
                          ? "text-green-300"
                          : player.name === playerName
                            ? "text-orange-300"
                            : "text-white"
                      }`}
                    >
                      {player.name}
                    </h3>
                    {player.isHost && (
                      <p className="text-sm text-green-300">Host</p>
                    )}
                    {player.name === playerName && (
                      <p className="text-sm text-orange-300">You</p>
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
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setGameStarted(false)}
                  className="rounded-lg bg-gray-600 px-6 py-2 text-white hover:bg-gray-700"
                >
                  Back to Room
                </button>
                <button
                  onClick={() => setHasJoined(false)}
                  className="rounded-lg bg-red-600 px-6 py-2 text-white hover:bg-red-700"
                >
                  Leave Game
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
