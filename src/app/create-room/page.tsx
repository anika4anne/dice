"use client";

import Link from "next/link";
import { useState } from "react";

type GameMode = {
  name: string;
  description: string;
  rules: string[];
};

type GameModes = {
  [key: string]: GameMode;
};

export default function HowToPlayPage() {
  const [activeTab, setActiveTab] = useState<string>("classic");
  const [showBasics, setShowBasics] = useState(false);

  const gameModes: GameModes = {
    classic: {
      name: "Classic",
      description: "Add up all your dice",
      rules: [
        "Roll 5 dice",
        "Add them all up",
        "Higher total = better score",
        "Simple and fun",
      ],
    },
    multiply: {
      name: "Multiply",
      description: "Multiply all dice together",
      rules: [
        "Roll 5 dice",
        "Multiply them all together",
        "Watch out for 1s - they kill your score!",
        "High risk, high reward",
      ],
    },
    highest: {
      name: "Highest",
      description: "Only your best die counts",
      rules: [
        "Roll 5 dice",
        "Only the highest number matters",
        "Ignore everything else",
        "Simple strategy",
      ],
    },
    lowest: {
      name: "Lowest",
      description: "Only your worst die counts",
      rules: [
        "Roll 5 dice",
        "Only the lowest number matters",
        "Ignore everything else",
        "Tricky but fun",
      ],
    },
    pairs: {
      name: "Pairs",
      description: "Get points for matching dice",
      rules: [
        "Roll 5 dice",
        "10 points for each pair",
        "Three of a kind = 20 points",
        "Match as many as you can",
      ],
    },
  };

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundImage: "url('/bg.avif')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center rounded-lg bg-blue-900 px-4 py-2 text-white hover:bg-blue-800"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </Link>
          <h1 className="mt-4 text-center text-4xl font-bold text-white">
            How to Play
          </h1>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {Object.entries(gameModes).map(([key, mode]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                  activeTab === key
                    ? "bg-blue-600 text-white"
                    : "bg-blue-900/60 text-blue-200 hover:bg-blue-800/80"
                }`}
              >
                {mode.name}
              </button>
            ))}
          </div>
        </div>

        {/* Basic Rules */}
        <div className="mb-8 rounded-lg bg-blue-900 p-6 text-white">
          <button
            onClick={() => setShowBasics(!showBasics)}
            className="flex w-full items-center justify-between text-left"
          >
            <h2 className="text-2xl font-bold text-blue-200">The Basics</h2>
            <svg
              className={`h-6 w-6 transform transition-transform ${
                showBasics ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showBasics && (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-2 font-semibold text-blue-100">
                  Getting Started
                </h3>
                <ul className="space-y-1 text-sm">
                  <li>• Pick a game mode</li>
                  <li>• Choose how many rounds</li>
                  <li>• Pick your dice (4-20 sides)</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-blue-100">Playing</h3>
                <ul className="space-y-1 text-sm">
                  <li>• You get 3 rolls each turn</li>
                  <li>• Keep dice you like, re-roll the rest</li>
                  <li>• Highest score wins</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Active Tab Content */}
        <div className="rounded-lg bg-blue-900 p-6 text-white">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-blue-200">
              {gameModes[activeTab]?.name}
            </h2>
            <p className="text-blue-100">{gameModes[activeTab]?.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="mb-3 font-semibold text-blue-100">How it works:</h3>
            <ul className="space-y-2">
              {gameModes[activeTab]?.rules.map(
                (rule: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2 text-blue-300">•</span>
                    <span>{rule}</span>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Example */}
          <div className="rounded bg-green-800 p-4">
            <h4 className="mb-2 font-semibold text-green-100">Example:</h4>
            <p className="text-sm text-green-200">
              {activeTab === "classic" &&
                "Roll: 3, 4, 1, 6, 2 → Score: 16 points"}
              {activeTab === "multiply" &&
                "Roll: 3, 4, 1, 6, 2 → Score: 144 points"}
              {activeTab === "highest" &&
                "Roll: 3, 4, 1, 6, 2 → Score: 6 points"}
              {activeTab === "lowest" && "Roll: 3, 4, 1, 6, 2 → Score: 1 point"}
              {activeTab === "pairs" &&
                "Roll: 3, 3, 1, 6, 2 → Score: 10 points (one pair)"}
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/single-player"
            className="inline-flex items-center rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700"
          >
            Start Playing
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
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}
