"use client";

import Link from "next/link";
import { useState } from "react";

export default function MultiplayerPage() {
  const [rounds, setRounds] = useState("5");
  const [gameMode, setGameMode] = useState("classic");
  const [diceType, setDiceType] = useState("6-sided");
  const [players, setPlayers] = useState<string[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [playerDice, setPlayerDice] = useState<number[][]>([]);
  const [playerScores, setPlayerScores] = useState<number[]>([]);
  const [playerWins, setPlayerWins] = useState<number[]>([]);
  const [roundWinners, setRoundWinners] = useState<number[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [finalResults, setFinalResults] = useState<
    Array<{ name: string; wins: number; score: number; isWinner: boolean }>
  >([]);
  const [roundScores, setRoundScores] = useState<number[]>([]);
  const [canRoll, setCanRoll] = useState(true);
  const [roundComplete, setRoundComplete] = useState(false);

  const addPlayer = () => {
    if (players.length < 6) {
      const playerName = `Player ${players.length + 1}`;
      setPlayers([...players, playerName]);
    }
  };

  const removePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const updatePlayerName = (index: number, newName: string) => {
    const updatedPlayers = [...players];
    updatedPlayers[index] = newName;
    setPlayers(updatedPlayers);
  };

  const startGame = () => {
    if (players.length < 2) return;

    const initialDice = players.map(() => [1, 1, 1, 1, 1]);
    const initialScores = players.map(() => 0);
    const initialWins = players.map(() => 0);
    const initialRoundScores = players.map(() => 0);

    setPlayerDice(initialDice);
    setPlayerScores(initialScores);
    setPlayerWins(initialWins);
    setRoundScores(initialRoundScores);
    setCurrentRound(1);
    setCurrentPlayer(0);
    setGameStarted(true);
    setRoundWinners([]);
    setShowLeaderboard(false);
    setCanRoll(true);
    setRoundComplete(false);
  };

  const calculateScore = (dice: number[]): number => {
    switch (gameMode) {
      case "classic":
        return dice.reduce((sum, die) => sum + die, 0);
      case "multiply":
        return dice.reduce((product, die) => product * die, 1);
      case "highest":
        return Math.max(...dice);
      case "lowest":
        return Math.min(...dice);
      case "pairs":
        const counts: Record<number, number> = {};
        dice.forEach((die) => {
          counts[die] = (counts[die] ?? 0) + 1;
        });
        let pairScore = 0;
        Object.values(counts).forEach((count) => {
          if (count >= 2) {
            pairScore += count * 10;
          }
        });
        return pairScore;
      default:
        return dice.reduce((sum, die) => sum + die, 0);
    }
  };

  const determineRoundWinner = (): number => {
    const scores = roundScores;
    if (scores.length === 0) return 0;

    let winnerIndex = 0;
    let bestScore = scores[0] ?? 0;

    for (let i = 1; i < scores.length; i++) {
      const currentScore = scores[i] ?? 0;
      if (currentScore > bestScore) {
        bestScore = currentScore;
        winnerIndex = i;
      }
    }

    return winnerIndex;
  };

  const rollDice = () => {
    if (players.length === 0 || !canRoll) return;

    const newDice = [...playerDice];
    const diceTypeNumber = diceType.split("-")[0];
    if (!diceTypeNumber) return;

    const maxValue = parseInt(diceTypeNumber);

    if (newDice[currentPlayer]) {
      newDice[currentPlayer] = newDice[currentPlayer].map(
        () => Math.floor(Math.random() * maxValue) + 1,
      );

      setPlayerDice(newDice);
      setCanRoll(false);

      const playerScore = calculateScore(newDice[currentPlayer]);
      const newRoundScores = [...roundScores];
      newRoundScores[currentPlayer] = playerScore;
      setRoundScores(newRoundScores);

      setTimeout(() => {
        if (currentPlayer < players.length - 1) {
          setCurrentPlayer(currentPlayer + 1);
          setCanRoll(true);
        } else {
          setRoundComplete(true);
        }
      }, 2000);
    }
  };

  const nextRound = () => {
    const roundWinner = determineRoundWinner();
    const newRoundWinners = [...roundWinners, roundWinner];
    setRoundWinners(newRoundWinners);

    const newPlayerWins = [...playerWins];
    if (newPlayerWins[roundWinner] !== undefined) {
      newPlayerWins[roundWinner]++;
    }
    setPlayerWins(newPlayerWins);

    const newPlayerScores = [...playerScores];
    newPlayerScores.forEach((_, index) => {
      if (
        newPlayerScores[index] !== undefined &&
        roundScores[index] !== undefined
      ) {
        newPlayerScores[index] += roundScores[index];
      }
    });
    setPlayerScores(newPlayerScores);

    if (currentRound < parseInt(rounds)) {
      setCurrentRound(currentRound + 1);
      setCurrentPlayer(0);

      setPlayerDice(players.map(() => [1, 1, 1, 1, 1]));
      setRoundScores(players.map(() => 0));
      setCanRoll(true);
      setRoundComplete(false);
    } else {
      const maxWins = Math.max(...newPlayerWins);
      const results = players.map((name, index) => ({
        name,
        wins: newPlayerWins[index] ?? 0,
        score: newPlayerScores[index] ?? 0,
        isWinner: (newPlayerWins[index] ?? 0) === maxWins,
      }));
      setFinalResults(results);
      setShowLeaderboard(true);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setCurrentRound(1);
    setCurrentPlayer(0);
    setPlayerDice([]);
    setPlayerScores([]);
    setPlayerWins([]);
    setRoundWinners([]);
    setShowLeaderboard(false);
    setFinalResults([]);
    setRoundScores([]);
    setCanRoll(true);
    setRoundComplete(false);
  };

  if (showLeaderboard) {
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
        <div className="flex min-h-screen items-center justify-center p-8">
          <div className="w-full max-w-md rounded-xl bg-black p-8 shadow-2xl">
            <h2 className="mb-6 text-center text-3xl font-bold text-white">
              🏆 game results 🏆
            </h2>

            <div className="mb-6 space-y-4">
              {finalResults.map((player, index) => (
                <div
                  key={player.name}
                  className={`flex items-center justify-between rounded-lg p-4 ${
                    player.isWinner
                      ? "border-2 border-yellow-400 bg-gradient-to-r from-yellow-400/20 to-orange-400/20"
                      : "bg-white/10"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`text-2xl ${player.isWinner ? "text-yellow-400" : "text-gray-400"}`}
                    >
                      {index === 0 ? "🥇" : "🥈"}
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
                    <div className="text-xs text-gray-400">final score</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-4">
              <button
                onClick={resetGame}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-white transition-colors hover:bg-blue-700"
              >
                play again
              </button>
              <Link
                href="/"
                className="flex-1 rounded-lg bg-gray-600 px-4 py-3 text-center text-white transition-colors hover:bg-gray-700"
              >
                main menu
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (gameStarted) {
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
            🎲 Multiplayer Dice Game
          </h1>

          <div className="mb-8 text-center text-white">
            <p className="mb-2 text-xl">
              Round {currentRound} of {rounds}
            </p>
            <p className="mb-4 text-lg">
              Mode: {gameMode} | Dice: {diceType}
            </p>
            <p className="text-lg">
              Current Turn:{" "}
              <span className="text-yellow-300">{players[currentPlayer]}</span>
            </p>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {players.map((player, index) => (
              <div
                key={index}
                className={`rounded-lg p-4 ${
                  index === currentPlayer
                    ? "border-2 border-yellow-400 bg-gray-800/80"
                    : "bg-gray-700/80"
                }`}
              >
                <h3
                  className={`mb-2 text-center font-bold ${
                    index === currentPlayer ? "text-yellow-300" : "text-white"
                  }`}
                >
                  {player}
                </h3>
                <p className="mb-3 text-center text-sm text-gray-300">
                  Wins: {playerWins[index]} | Total Score: {playerScores[index]}
                </p>
                {roundScores[index] !== undefined && roundScores[index] > 0 && (
                  <p className="mb-3 text-center text-sm text-green-300">
                    Round Score: {roundScores[index]}
                  </p>
                )}
                <div className="grid grid-cols-5 gap-1">
                  {playerDice[index]?.map((die, dieIndex) => (
                    <div
                      key={dieIndex}
                      className="h-8 w-8 rounded bg-white text-center text-sm leading-8 font-bold text-gray-800"
                    >
                      {die}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {roundComplete && (
            <div className="mb-6 rounded-lg bg-gray-800/80 p-4">
              <h3 className="mb-3 text-center text-lg font-bold text-white">
                Round {currentRound} Results
              </h3>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {players.map((player, index) => (
                  <div
                    key={index}
                    className="flex justify-between rounded bg-gray-700/50 px-3 py-2"
                  >
                    <span className="text-white">{player}</span>
                    <span className="font-semibold text-green-300">
                      {roundScores[index] ?? 0} points
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!roundComplete ? (
            <div className="text-center">
              <p className="mb-4 text-lg text-white">
                {canRoll
                  ? `${players[currentPlayer]}'s turn to roll!`
                  : `${players[currentPlayer]} is rolling...`}
              </p>
              <button
                onClick={rollDice}
                disabled={!canRoll}
                className="rounded-lg bg-blue-600 px-8 py-3 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {canRoll ? "Roll Dice" : "Rolling..."}
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="mb-4 text-xl text-yellow-300">
                Round {currentRound} Complete!
              </p>
              <p className="mb-4 text-lg text-white">
                Winner: {players[determineRoundWinner()] ?? "Unknown"} with{" "}
                {Math.max(
                  ...roundScores.filter((score) => score !== undefined),
                )}{" "}
                points!
              </p>
              <button
                onClick={nextRound}
                className="rounded-lg bg-green-600 px-8 py-3 text-white hover:bg-green-700"
              >
                {currentRound < parseInt(rounds) ? "Next Round" : "End Game"}
              </button>
            </div>
          )}
        </div>
      </main>
    );
  }

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
          🎲 multiplayer dice game
        </h1>

        <div className="mb-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-white">settings</h2>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-white">rounds:</label>
              <select
                value={rounds}
                onChange={(e) => setRounds(e.target.value)}
                className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white"
              >
                <option value="3">3 rounds</option>
                <option value="5">5 rounds</option>
                <option value="7">7 rounds</option>
                <option value="10">10 rounds</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-white">game mode:</label>
              <select
                value={gameMode}
                onChange={(e) => setGameMode(e.target.value)}
                className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white"
              >
                <option value="classic">classic (sum)</option>
                <option value="multiply">multiply</option>
                <option value="highest">highest</option>
                <option value="lowest">lowest</option>
                <option value="pairs">pairs</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-white">dice type:</label>
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

            <div>
              <label className="mb-2 block text-white">
                players ({players.length}/6):
              </label>
              <button
                onClick={addPlayer}
                disabled={players.length >= 6}
                className="w-full rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-600"
              >
                add player
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-4 text-xl font-bold text-white">players</h3>
            {players.length === 0 ? (
              <p className="text-gray-300">
                no players added yet. add at least 2 players to start!
              </p>
            ) : (
              <div className="space-y-2">
                {players.map((player, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-gray-700 px-4 py-2"
                  >
                    <input
                      type="text"
                      value={player}
                      onChange={(e) => updatePlayerName(index, e.target.value)}
                      className="mr-2 flex-1 rounded border border-gray-600 bg-gray-800 px-2 py-1 text-white placeholder-gray-400"
                      placeholder="enter player name"
                    />
                    <button
                      onClick={() => removePlayer(index)}
                      className="rounded bg-red-600 px-2 py-1 text-sm text-white hover:bg-red-700"
                    >
                      remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={startGame}
            disabled={players.length < 2}
            className="rounded-lg bg-blue-600 px-8 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            start game
          </button>
        </div>
      </div>
    </main>
  );
}
