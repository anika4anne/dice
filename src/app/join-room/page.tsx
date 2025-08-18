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
    {
      id: 1,
      name: "Host",
      isHost: true,
      score: 0,
      dice: [1, 1, 1, 1, 1],
      isCurrentTurn: false,
      rollsLeft: 3,
    },
    {
      id: 2,
      name: "Player 2",
      isHost: false,
      score: 0,
      dice: [1, 1, 1, 1, 1],
      isCurrentTurn: false,
      rollsLeft: 3,
    },
  ]);
  const [currentPlayerId, setCurrentPlayerId] = useState<number | null>(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [roundScores, setRoundScores] = useState<Record<number, number>[]>([]);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [hasBeenRemoved, setHasBeenRemoved] = useState(false);

  useEffect(() => {
    if (roomCode && hasJoined) {
      const interval = setInterval(() => {
        const rooms = getRooms();
        const room = rooms.get(roomCode);
        if (room) {
          const isPlayerStillInRoom = room.players.some(
            (p) => p.id === currentPlayerId,
          );

          if (!isPlayerStillInRoom && currentPlayerId) {
            setHasBeenRemoved(true);
            return;
          }

          setPlayers(room.players);
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
  }, [roomCode, hasJoined, currentPlayerId]);

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

    const rooms = getRooms();
    const room = rooms.get(roomCode);
    if (!room) {
      setTimeout(() => {
        setIsJoining(false);
        alert("Room not found! Please check the room code.");
      }, 1500);
      return;
    }

    if (room.players.length >= 6) {
      setTimeout(() => {
        setIsJoining(false);
        alert("Room is full! Please try another room.");
      }, 1500);
      return;
    }

    setTimeout(() => {
      const newPlayerId = Date.now();
      const newPlayer = {
        id: newPlayerId,
        name: playerName,
        isHost: false,
        score: 0,
        dice: [1, 1, 1, 1, 1],
        isCurrentTurn: false,
        rollsLeft: 3,
      };

      const updatedPlayers = [...room.players, newPlayer];

      rooms.set(roomCode, {
        ...room,
        players: updatedPlayers,
      });
      saveRooms(rooms);

      setPlayers(updatedPlayers);
      setCurrentPlayerId(newPlayerId);
      setIsJoining(false);
      setHasJoined(true);
      setHasBeenRemoved(false);
    }, 1500);
  };

  const leaveRoom = () => {
    if (roomCode && currentPlayerId) {
      const rooms = getRooms();
      const room = rooms.get(roomCode);
      if (room) {
        const updatedPlayers = room.players.filter(
          (p) => p.id !== currentPlayerId,
        );
        rooms.set(roomCode, {
          ...room,
          players: updatedPlayers,
        });
        saveRooms(rooms);
      }
    }
    setHasJoined(false);
    setCurrentPlayerId(null);
    setGameStarted(false);
    setHasBeenRemoved(false);
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

  const rollDice = () => {
    const currentPlayer = players[currentPlayerIndex];
    if (
      !currentPlayer ||
      currentPlayer.rollsLeft <= 0 ||
      currentPlayer.id !== currentPlayerId
    )
      return;

    const max = getDiceMax();
    const newDice = currentPlayer.dice?.map(
      () => Math.floor(Math.random() * max) + 1,
    ) || [1, 1, 1, 1, 1];

    const updatedPlayers = players.map((player, index) =>
      index === currentPlayerIndex
        ? { ...player, dice: newDice, rollsLeft: player.rollsLeft - 1 }
        : player,
    );

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
    if (!currentPlayer || currentPlayer.id !== currentPlayerId) return;

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

        <h1 className="mb-8 text-4xl font-bold text-white">join room</h1>

        {hasBeenRemoved ? (
          <div className="mb-8 text-center">
            <div className="rounded-md border-2 border-red-500 bg-white/10 p-6 shadow-xl backdrop-blur-sm">
              <h2 className="mb-4 text-2xl font-bold text-white">
                ❌ You have been removed from the room
              </h2>
              <div className="space-x-4">
                <button
                  onClick={() => {
                    setHasBeenRemoved(false);
                    setRoomCode("");
                    setPlayerName("");
                    setHasJoined(false);
                    setCurrentPlayerId(null);
                    setGameStarted(false);
                  }}
                  className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
                >
                  Join Another Room
                </button>
                <Link
                  href="/create-room"
                  className="inline-block rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700"
                >
                  Create New Room
                </Link>
              </div>
            </div>
          </div>
        ) : !hasJoined ? (
          <div className="mb-8 text-center">
            <div className="mb-6 space-y-4">
              <div>
                <label className="mb-2 block text-white">room code:</label>
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
                <label className="mb-2 block text-white">your name:</label>
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
              className="rounded-lg bg-green-600 px-8 py-3 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {isJoining ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>joining...</span>
                </div>
              ) : (
                "join room"
              )}
            </button>
          </div>
        ) : !gameStarted ? (
          <div className="mb-8 text-center">
            <div className="mb-6 rounded-lg bg-green-900 p-6">
              <h3 className="mb-4 text-xl font-bold text-white">
                🎉 successfully joined!
              </h3>
              <p className="mb-2 text-lg text-green-300">
                Room Code: {roomCode}
              </p>
              <p className="text-gray-300">
                welcome, {playerName}! waiting for the host to start the game...
              </p>
              <p className="mt-2 text-xs text-green-300"></p>
            </div>

            <div className="mb-6 rounded-lg bg-blue-900 p-4">
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
                        : player.id === currentPlayerId
                          ? "border border-orange-400 bg-orange-400/20"
                          : "border border-gray-600 bg-white/5"
                    }`}
                  >
                    {player.isHost && <span className="text-lg">👑</span>}
                    <span
                      className={`font-medium ${
                        player.isHost
                          ? "text-green-300"
                          : player.id === currentPlayerId
                            ? "text-orange-300"
                            : "text-white"
                      }`}
                    >
                      {player.name}
                    </span>
                    {player.isHost && (
                      <span className="text-xs text-green-300">(Host)</span>
                    )}
                    {player.id === currentPlayerId && (
                      <span className="text-xs text-orange-300">(You)</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-purple-900 p-4">
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
                onClick={leaveRoom}
                className="rounded-lg bg-gray-600 px-6 py-2 text-white hover:bg-gray-700"
              >
                Leave Room
              </button>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowHowToPlay(true)}
                className="rounded-2xl bg-teal-600 px-8 py-3 text-white transition-colors hover:bg-teal-700"
              >
                <div className="flex items-center">
                  <span className="font-semibold">How to Play</span>
                  <svg
                    className="ml-2 h-5 w-5"
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
                  onClick={leaveRoom}
                  className="rounded-lg bg-gray-600 px-6 py-2 text-white hover:bg-gray-700"
                >
                  Leave Game
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
                    {currentPlayerId === players[currentPlayerIndex]?.id ? (
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
                              className="rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700"
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
                          ? "border-2 border-blue-400 bg-blue-400/20"
                          : player.isHost
                            ? "border-2 border-green-400 bg-green-400/20"
                            : player.id === currentPlayerId
                              ? "border-2 border-green-400 bg-green-400/20"
                              : "bg-white/10"
                      }`}
                    >
                      <div className="text-center">
                        <div className="mb-3 text-2xl">
                          {player.isHost ? (
                            <span className="text-xl">👑</span>
                          ) : index === currentPlayerIndex ? (
                            <span className="text-xl">👤</span>
                          ) : player.id === currentPlayerId ? (
                            <span className="text-xl">👤</span>
                          ) : (
                            <span className="text-xl">👤</span>
                          )}
                        </div>
                        <h3
                          className={`mb-2 text-lg font-bold ${
                            index === currentPlayerIndex
                              ? "text-blue-300"
                              : player.isHost
                                ? "text-green-300"
                                : player.id === currentPlayerId
                                  ? "text-green-300"
                                  : "text-white"
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
                        {player.id === currentPlayerId && (
                          <p className="text-sm text-green-300">You</p>
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
                    onClick={leaveRoom}
                    className="rounded-lg bg-red-600 px-6 py-2 text-white hover:bg-red-700"
                  >
                    Leave Game
                  </button>
                </div>
              </>
            )}
          </div>
        )}

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
                      • End your turn when you&apos;re happy with what you got
                    </p>
                    <p>
                      • Play a few rounds and whoever has the most points wins!
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
                        Just add up all your dice! Like 3+4+1+6+2 = 16 points
                      </p>
                    </div>
                    <div className="border-l-2 border-purple-400 pl-3">
                      <p className="font-semibold text-purple-200">Multiply:</p>
                      <p>
                        Multiply everything together! 3×4×1×6×2 = 144 points
                        (watch out for 1s!)
                      </p>
                    </div>
                    <div className="border-l-2 border-green-400 pl-3">
                      <p className="font-semibold text-green-200">Highest:</p>
                      <p>Only your best die counts! 3,4,1,6,2 = 6 points</p>
                    </div>
                    <div className="border-l-2 border-yellow-400 pl-3">
                      <p className="font-semibold text-yellow-200">Lowest:</p>
                      <p>Only your worst die counts! 3,4,1,6,2 = 1 point</p>
                    </div>
                    <div className="border-l-2 border-red-400 pl-3">
                      <p className="font-semibold text-red-200">Pairs:</p>
                      <p>
                        Get 10 points for each pair! Two 3s = 10 points, three
                        3s = 20 points
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
                        Get your friends! Up to 6 players, create rooms or join
                        existing ones
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-lg font-semibold text-orange-300">
                    About the dice:
                  </p>
                  <div className="ml-4 space-y-1">
                    <p>• Pick from 4-sided all the way up to 20-sided dice</p>
                    <p>• More sides = bigger possible scores (duh!)</p>
                    <p>• 6-sided is the classic choice, but try others!</p>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-lg font-semibold text-green-300">
                    Pro tips:
                  </p>
                  <div className="ml-4 space-y-1">
                    <p>• Classic mode: just go for high numbers</p>
                    <p>• Multiply mode: 1s are your enemy! Try to avoid them</p>
                    <p>• Pairs mode: matching numbers are your friend</p>
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
      </div>
    </main>
  );
}
