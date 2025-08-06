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

  