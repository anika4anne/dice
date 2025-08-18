"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCrown } from "@fortawesome/free-solid-svg-icons";

interface Player {
  id: number;
  name: string;
  isHost: boolean;
  score: number;
  dice: number[];
  isCurrentTurn: boolean;
  rollsLeft: number;
  color: string;
}

interface RoomData {
  players: Player[];
  totalRounds: number;
  gameMode: string;
  diceType: string;
  gameStarted: boolean;
  currentRound: number;
  currentPlayerIndex: number;
  roundScores: Record<number, number>[];
}

const getRooms = (): Map<string, RoomData> => {
  if (typeof window === "undefined") return new Map();

  const stored = localStorage.getItem("dice-game-rooms");
  if (stored) {
    const parsed = JSON.parse(stored) as Record<string, RoomData>;
    return new Map(Object.entries(parsed));
  }
  return new Map();
};

const saveRooms = (rooms: Map<string, RoomData>) => {
  if (typeof window === "undefined") return;

  const obj = Object.fromEntries(rooms);
  localStorage.setItem("dice-game-rooms", JSON.stringify(obj));
};

export default function CreateRoomPage() {
  const [roomCode, setRoomCode] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [totalRounds, setTotalRounds] = useState(5);
  const [gameMode, setGameMode] = useState("classic");
  const [diceType, setDiceType] = useState("6-sided");
  const [players, setPlayers] = useState<Player[]>([
    {
      id: 1,
      name: "Host",
      isHost: true,
      score: 0,
      dice: [1, 1, 1, 1, 1],
      isCurrentTurn: false,
      rollsLeft: 3,
      color: "#FCD34D", // Default yellow color
    },
  ]);
  const [hostName, setHostName] = useState("");
  const [showRoomInfo, setShowRoomInfo] = useState(false);
  const [copyStatus, setCopyStatus] = useState("Copy");
  const [currentRound, setCurrentRound] = useState(1);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [roundScores, setRoundScores] = useState<Record<number, number>[]>([]);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [playerToRemove, setPlayerToRemove] = useState<Player | null>(null);
  const [joinNotification, setJoinNotification] = useState<{
    name: string;
    visible: boolean;
  }>({ name: "", visible: false });

  useEffect(() => {
    if (roomCode && showRoomInfo) {
      const interval = setInterval(() => {
        const rooms = getRooms();
        const room = rooms.get(roomCode);
        if (room) {
          // Check if a new player joined
          if (room.players.length > players.length) {
            const newPlayer = room.players.find(
              (p) => !players.some((existing) => existing.id === p.id),
            );
            if (newPlayer) {
              console.log("New player detected:", newPlayer.name);
              showJoinNotification(newPlayer.name);
            }
          }

          // Ensure all players have colors
          const playersWithColors = room.players.map((player) => ({
            ...player,
            color: player.color || "#FCD34D",
          }));
          setPlayers(playersWithColors);
          setTotalRounds(room.totalRounds);
          setGameMode(room.gameMode);
          setDiceType(room.diceType);
          setGameStarted(room.gameStarted);
          setCurrentRound(room.currentRound || 1);
          setCurrentPlayerIndex(room.currentPlayerIndex || 0);
          setRoundScores(room.roundScores || []);
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [roomCode, showRoomInfo, players.length]);

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

  const rollDice = () => {
    const currentPlayer = players[currentPlayerIndex];
    if (!currentPlayer || currentPlayer.rollsLeft <= 0) return;

    const max = getDiceMax();
    const newDice = currentPlayer.dice?.map(
      () => Math.floor(Math.random() * max) + 1,
    ) || [1, 1, 1, 1, 1];

    const updatedPlayers = players.map((player, index) =>
      index === currentPlayerIndex
        ? { ...player, dice: newDice, rollsLeft: player.rollsLeft - 1 }
        : player,
    );

    setPlayers(updatedPlayers);

    if (roomCode) {
      const rooms = getRooms();
      const room = rooms.get(roomCode);
      if (room) {
        rooms.set(roomCode, {
          ...room,
          players: updatedPlayers,
        });
        saveRooms(rooms);
      }
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

  const endTurn = () => {
    const currentPlayer = players[currentPlayerIndex];
    if (!currentPlayer) return;

    const score = calculateScore(currentPlayer.dice);
    const newRoundScores = [...roundScores];
    if (!newRoundScores[currentRound - 1]) {
      newRoundScores[currentRound - 1] = {};
    }
    newRoundScores[currentRound - 1]![currentPlayer.id] = score;

    const updatedPlayers = players.map((player, index) =>
      index === currentPlayerIndex
        ? {
            ...player,
            score: player.score + score,
            rollsLeft: 3,
            dice: [1, 1, 1, 1, 1],
          }
        : player,
    );

    let nextPlayerIndex = currentPlayerIndex + 1;
    let nextRound = currentRound;

    if (nextPlayerIndex >= players.length) {
      nextPlayerIndex = 0;
      nextRound = currentRound + 1;
    }

    setCurrentPlayerIndex(nextPlayerIndex);
    setCurrentRound(nextRound);
    setRoundScores(newRoundScores);
    setPlayers(updatedPlayers);

    if (roomCode) {
      const rooms = getRooms();
      const room = rooms.get(roomCode);
      if (room) {
        rooms.set(roomCode, {
          ...room,
          players: updatedPlayers,
          currentRound: nextRound,
          currentPlayerIndex: nextPlayerIndex,
          roundScores: newRoundScores,
        });
        saveRooms(rooms);
      }
    }

    if (nextRound > totalRounds) {
      void confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  const generateRoomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setRoomCode(code);
    setShowRoomInfo(true);

    const rooms = getRooms();
    rooms.set(code, {
      players: [
        {
          id: 1,
          name: "Host",
          isHost: true,
          score: 0,
          dice: [1, 1, 1, 1, 1],
          isCurrentTurn: false,
          rollsLeft: 3,
          color: "#FCD34D", // Default yellow color
        },
      ],
      totalRounds,
      gameMode,
      diceType,
      gameStarted: false,
      currentRound: 1,
      currentPlayerIndex: 0,
      roundScores: [],
    });
    saveRooms(rooms);
  };

  const removePlayer = (id: number) => {
    if (id !== 1) {
      const player = players.find((p) => p.id === id);
      if (player) {
        setPlayerToRemove(player);
        setShowRemoveConfirm(true);
      }
    }
  };

  const confirmRemovePlayer = () => {
    if (playerToRemove) {
      const updatedPlayers = players.filter(
        (player) => player.id !== playerToRemove.id,
      );
      setPlayers(updatedPlayers);

      if (roomCode) {
        const rooms = getRooms();
        const room = rooms.get(roomCode);
        if (room) {
          rooms.set(roomCode, {
            ...room,
            players: updatedPlayers,
          });
          saveRooms(rooms);
        }
      }

      setShowRemoveConfirm(false);
      setPlayerToRemove(null);
    }
  };

  const updatePlayerName = (id: number, name: string) => {
    const updatedPlayers = players.map((player) =>
      player.id === id ? { ...player, name } : player,
    );
    setPlayers(updatedPlayers);

    if (roomCode) {
      const rooms = getRooms();
      const room = rooms.get(roomCode);
      if (room) {
        rooms.set(roomCode, {
          ...room,
          players: updatedPlayers,
        });
        saveRooms(rooms);
      }
    }
  };

  const changePlayerColor = (playerId: number, newColor: string) => {
    const updatedPlayers = players.map((player) =>
      player.id === playerId ? { ...player, color: newColor } : player,
    );
    setPlayers(updatedPlayers);

    if (roomCode) {
      const rooms = getRooms();
      const room = rooms.get(roomCode);
      if (room) {
        rooms.set(roomCode, {
          ...room,
          players: updatedPlayers,
        });
        saveRooms(rooms);
      }
    }
  };

  const showJoinNotification = (playerName: string) => {
    console.log("Showing join notification for:", playerName);
    setJoinNotification({ name: playerName, visible: true });
    setTimeout(() => {
      console.log("Hiding join notification");
      setJoinNotification({ name: "", visible: false });
    }, 3000);
  };

  const getTextColor = (backgroundColor: string) => {
    if (!backgroundColor || typeof backgroundColor !== "string") {
      return "text-black"; // Default to black text
    }
    const hex = backgroundColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const brightness = r * 0.299 + g * 0.587 + b * 0.114;

    return brightness > 128 ? "text-black" : "text-white";
  };

  const startGame = async () => {
    if (!hostName.trim()) {
      alert("Please enter your name to start the game!");
      return;
    }
    if (players.length < 2) {
      alert("You need at least 2 players to start the game!");
      return;
    }

    const gamePlayers = players.map((player, index) => ({
      ...player,
      score: 0,
      dice: [1, 1, 1, 1, 1],
      isCurrentTurn: index === 0,
      rollsLeft: 3,
      color: player.color || "#FCD34D", // Ensure color is preserved
    }));

    setPlayers(gamePlayers);
    setGameStarted(true);
    setCurrentPlayerIndex(0);
    setCurrentRound(1);
    setRoundScores([]);

    if (roomCode) {
      const rooms = getRooms();
      const room = rooms.get(roomCode);
      if (room) {
        rooms.set(roomCode, {
          ...room,
          players: gamePlayers,
          gameStarted: true,
          currentRound: 1,
          currentPlayerIndex: 0,
          roundScores: [],
        });
        saveRooms(rooms);
      }
    }

    void confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
  };

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus("Copy"), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = roomCode;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
      } catch {}
      document.body.removeChild(textArea);
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus("Copy"), 2000);
    }
  };

  const isGameOver = currentRound > totalRounds;

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

        <h1 className="mb-8 text-4xl font-bold text-white">create room</h1>

        {!gameStarted ? (
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-2xl font-bold text-white">room setup</h2>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-white">your name:</label>
                <input
                  type="text"
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white placeholder-gray-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-white">rounds:</label>
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
                <label className="mb-2 block text-white">game mode:</label>
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
                <label className="mb-2 block text-white">dice type:</label>
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
                generate room code
              </button>
            ) : (
              <div className="space-y-6">
                <div className="rounded-lg bg-green-900 p-6">
                  <h3 className="mb-4 text-xl font-bold text-white">
                    room created!
                  </h3>
                  <div className="mb-4">
                    <p className="text-gray-300">
                      share this code with your friends:
                    </p>
                    <div className="mt-2 flex items-center justify-center space-x-2">
                      <span className="text-3xl font-bold text-green-300">
                        {roomCode}
                      </span>
                      <button
                        onClick={copyRoomCode}
                        className="rounded bg-green-600 px-3 py-1 text-sm text-white transition-colors hover:bg-green-700"
                      >
                        {copyStatus}
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">
                    game settings: {totalRounds} rounds, {gameMode} mode,{" "}
                    {diceType} dice
                  </p>
                </div>

                <div className="rounded-lg bg-white/10 p-4">
                  <h3 className="mb-2 text-lg font-bold text-white">
                    players ({players.length}/6)
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
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => setShowHowToPlay(true)}
                    className="group relative overflow-hidden rounded-2xl bg-white/10 px-8 py-3 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <div className="relative z-10 flex items-center text-white">
                      <span className="font-semibold">How to Play</span>
                      <svg
                        className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </button>
                </div>

                {showHowToPlay && (
                  <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                    <div className="mx-4 max-w-2xl rounded-lg bg-gray-800 p-6 shadow-xl">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">
                          How to Play Dice Game
                        </h3>
                        <button
                          onClick={() => setShowHowToPlay(false)}
                          className="rounded-full bg-gray-600 p-1 text-white hover:bg-gray-500"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="space-y-6 text-sm text-gray-300">
                        <div>
                          <p className="mb-2 text-lg font-semibold text-green-300">
                            How it works:
                          </p>
                          <div className="ml-4 space-y-1">
                            <p>• You get 3 rolls per turn (use them wisely!)</p>
                            <p>• Roll to try and get better scores</p>
                            <p>
                              • End your turn when you&apos;re happy with what
                              you got
                            </p>
                            <p>
                              • Play a few rounds and whoever has the most
                              points wins!
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="mb-2 text-lg font-semibold text-blue-300">
                            Different ways to score:
                          </p>
                          <div className="ml-4 space-y-2">
                            <div className="border-l-2 border-blue-400 pl-3">
                              <p className="font-semibold text-blue-200">
                                Classic (Sum):
                              </p>
                              <p>
                                Just add up all your dice! Like 3+4+1+6+2 = 16
                                points
                              </p>
                            </div>
                            <div className="border-l-2 border-purple-400 pl-3">
                              <p className="font-semibold text-purple-200">
                                Multiply:
                              </p>
                              <p>
                                Multiply everything together! 3*4*1*6*2 = 144
                                points (watch out for 1s!)
                              </p>
                            </div>
                            <div className="border-l-2 border-green-400 pl-3">
                              <p className="font-semibold text-green-200">
                                Highest:
                              </p>
                              <p>
                                Only your best die counts! 3,4,1,6,2 = 6 points
                              </p>
                            </div>
                            <div className="border-l-2 border-yellow-400 pl-3">
                              <p className="font-semibold text-yellow-200">
                                Lowest:
                              </p>
                              <p>
                                Only your worst die counts! 3,4,1,6,2 = 1 point
                              </p>
                            </div>
                            <div className="border-l-2 border-red-400 pl-3">
                              <p className="font-semibold text-red-200">
                                Pairs:
                              </p>
                              <p>
                                Get 10 points for each pair! Two 3s = 10 points,
                                three 3s = 20 points
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="mb-2 text-lg font-semibold text-yellow-300">
                            Ways to play:
                          </p>
                          <div className="ml-4 space-y-2">
                            <div className="border-l-2 border-purple-400 pl-3">
                              <p className="font-semibold text-purple-200">
                                Solo Mode:
                              </p>
                              <p>Play against a robot! Its good for learning</p>
                            </div>
                            <div className="border-l-2 border-pink-400 pl-3">
                              <p className="font-semibold text-pink-200">
                                Multiplayer:
                              </p>
                              <p>
                                Get your friends! Up to 6 players, create rooms
                                or join existing ones
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="mb-2 text-lg font-semibold text-orange-300">
                            About the dice:
                          </p>
                          <div className="ml-4 space-y-1">
                            <p>
                              • Pick from 4-sided all the way up to 20-sided
                              dice
                            </p>
                            <p>• More sides = bigger possible scores (duh!)</p>
                            <p>
                              • 6-sided is the classic choice, but try others!
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="mb-2 text-lg font-semibold text-green-300">
                            Pro tips:
                          </p>
                          <div className="ml-4 space-y-1">
                            <p>• Classic mode: just go for high numbers</p>
                            <p>
                              • Multiply mode: 1s are your enemy! Try to avoid
                              them
                            </p>
                            <p>
                              • Pairs mode: matching numbers are your friend
                            </p>
                            <p>
                              • Don&apos;t waste all 3 rolls if you already got
                              something good!
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={startGame}
                  disabled={players.length < 2 || !hostName.trim()}
                  className="rounded-lg bg-green-600 px-8 py-3 text-white hover:bg-green-700 disabled:opacity-50"
                >
                  start game
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            {isGameOver ? (
              <div className="mb-8 rounded-lg bg-gradient-to-br from-green-900 to-blue-900 p-8">
                <h2 className="mb-4 text-3xl font-bold text-white">
                  🎉 Game Over!
                </h2>
                <p className="mb-4 text-xl text-green-300">
                  Room Code: {roomCode}
                </p>
                <div className="mb-6">
                  <h3 className="mb-4 text-xl font-bold text-white">
                    Final Scores:
                  </h3>
                  <div className="space-y-2">
                    {players
                      .sort((a, b) => b.score - a.score)
                      .map((player, index) => (
                        <div
                          key={player.id}
                          className={`rounded-lg p-3 ${
                            index === 0
                              ? "border-2 border-yellow-400 bg-yellow-400/20"
                              : "bg-white/10"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-white">
                              {index + 1}. {player.name} {index === 0 && "👑"}
                            </span>
                            <span className="text-xl font-bold text-green-300">
                              {player.score} points
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                <button
                  onClick={() => setGameStarted(false)}
                  className="rounded-lg bg-gray-600 px-6 py-2 text-white hover:bg-gray-700"
                >
                  Back to Setup
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8 rounded-lg bg-blue-900 p-8">
                  <p className="mb-4 text-xl text-green-300">
                    Room Code: {roomCode}
                  </p>
                  <p className="text-gray-300">
                    Round {currentRound} of {totalRounds} • {players.length}{" "}
                    players
                  </p>
                </div>

                <div className="mb-8 rounded-lg bg-white/10 p-6">
                  <h3 className="mb-4 text-xl font-bold text-white">
                    {players[currentPlayerIndex]?.name}&apos;s Turn
                  </h3>
                  <p className="mb-4 text-gray-300">
                    Rolls left: {players[currentPlayerIndex]?.rollsLeft ?? 0}
                  </p>

                  <div className="mb-6 grid grid-cols-5 gap-4">
                    {players[currentPlayerIndex]?.dice?.map((value, index) => (
                      <div
                        key={index}
                        className="h-16 w-16 rounded-lg bg-white text-center text-2xl leading-[4rem] font-bold text-gray-800 shadow-lg"
                      >
                        {value}
                      </div>
                    )) ?? null}
                  </div>

                  <div className="text-center">
                    {players[currentPlayerIndex]?.id === 1 ? (
                      <div className="space-y-4">
                        <p className="text-lg font-bold text-green-300">
                          It&apos;s your turn!
                        </p>
                        <div className="flex justify-center space-x-4">
                          {(players[currentPlayerIndex]?.rollsLeft ?? 0) >
                            0 && (
                            <button
                              onClick={rollDice}
                              className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
                            >
                              Roll Dice
                            </button>
                          )}
                          {(players[currentPlayerIndex]?.rollsLeft ?? 0) <
                            3 && (
                            <button
                              onClick={endTurn}
                              className="rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-blue-700"
                            >
                              End Turn
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-lg font-bold text-blue-300">
                        Waiting for {players[currentPlayerIndex]?.name} to
                        play...
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-8 flex justify-center gap-6">
                  {players.map((player, index) => (
                    <div
                      key={player.id}
                      className={`w-52 rounded-lg p-6 ${
                        index === currentPlayerIndex
                          ? "border-2 border-blue-400"
                          : "border-2 border-blue-300"
                      }`}
                      style={{
                        backgroundColor: player.color
                          ? `${player.color}20`
                          : "#3B82F620",
                        borderColor: player.color || "#3B82F6",
                      }}
                    >
                      <div className="text-center">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="text-2xl">
                            {player.isHost ? (
                              <span className="text-xl">👑</span>
                            ) : (
                              <span className="text-xl">👤</span>
                            )}
                          </div>
                          <input
                            type="color"
                            value={player.color || "#3B82F6"}
                            onChange={(e) =>
                              changePlayerColor(player.id, e.target.value)
                            }
                            className="h-6 w-6 cursor-pointer rounded border-2 border-white"
                            title={`Change ${player.name}'s color`}
                          />
                        </div>
                        <h3
                          className={`mb-2 text-lg font-bold ${
                            index === currentPlayerIndex
                              ? "text-blue-300"
                              : "text-blue-200"
                          }`}
                        >
                          {player.name}
                        </h3>
                        <p className="mb-2 text-xl font-bold text-yellow-300">
                          {player.score} pts
                        </p>
                        {index === currentPlayerIndex && (
                          <p className="text-sm text-blue-300">Current Turn</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <p className="text-gray-300">
                    Game Settings: {totalRounds} rounds, {gameMode} mode,{" "}
                    {diceType} dice
                  </p>
                  <button
                    onClick={() => setGameStarted(false)}
                    className="rounded-lg bg-gray-600 px-6 py-2 text-white hover:bg-gray-700"
                  >
                    Back to Setup
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Join Notification */}
        {joinNotification.visible && (
          <div className="animate-slide-in-right fixed top-4 right-4 z-50">
            <div className="rounded-lg bg-green-600 p-4 shadow-lg">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🎉</span>
                <p className="font-medium text-white">
                  {joinNotification.name} has joined the room!
                </p>
              </div>
            </div>
          </div>
        )}

        {showRemoveConfirm && playerToRemove && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="mx-4 max-w-md rounded-lg border-2 border-red-500 bg-black p-6 shadow-xl">
              <h3 className="mb-4 text-xl font-bold text-white">
                Remove Player
              </h3>
              <p className="mb-6 text-gray-300">
                Are you sure you want to remove{" "}
                <span className="font-semibold text-white">
                  {playerToRemove.name}
                </span>
                ?
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowRemoveConfirm(false);
                    setPlayerToRemove(null);
                  }}
                  className="flex-1 rounded-lg bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemovePlayer}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
