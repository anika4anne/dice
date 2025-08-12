"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUsers } from "@fortawesome/free-solid-svg-icons";

export default function HomePage() {
  const [showHowToPlay, setShowHowToPlay] = useState(false);

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
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="mb-6 text-6xl font-black tracking-tight text-white sm:text-7xl md:text-8xl">
            <span className="text-white">🎲</span>
            <span className="text-white"> Dice</span>
            <span className="text-white"> Game</span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-300 sm:text-2xl">
            Created by Anika Anne
            <br />
          </p>
        </div>

        <div className="space-y-8">
          <div className="grid w-full max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2">
            <Link
              href="/single-player"
              className="group relative overflow-hidden rounded-2xl bg-white/10 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative z-10">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-purple-500/20">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="h-8 w-8 text-purple-300"
                  />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-white">
                  Play Solo
                </h3>
                <p className="mb-4 text-gray-300">
                  Wanna play against a robot? Perfect for practicing! ^_^
                </p>
                <div className="flex items-center text-purple-300 transition-transform duration-300 group-hover:translate-x-2">
                  <span className="font-semibold">Let&apos;s Play!</span>
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
                </div>
              </div>
            </Link>

            <Link
              href="/multiplayer"
              className="group relative overflow-hidden rounded-2xl bg-white/10 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-indigo-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative z-10">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-pink-500/20">
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="h-8 w-8 text-pink-300"
                  />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-white">
                  Play with Friends
                </h3>
                <p className="mb-4 text-gray-300">
                  Get your friends! Up to 6 players can join the fun! Perfect
                  for game nights!
                </p>
                <div className="flex items-center text-pink-300 transition-transform duration-300 group-hover:translate-x-2">
                  <span className="font-semibold">Let&apos;s Play!</span>
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
                </div>
              </div>
            </Link>
          </div>

          <div className="grid w-full max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2">
            <Link
              href="/create-room"
              className="group relative overflow-hidden rounded-2xl bg-white/10 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative z-10">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-green-500/20">
                  <svg
                    className="h-8 w-8 text-green-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 text-2xl font-bold text-white">
                  Create Private Room
                </h3>
                <p className="mb-4 text-gray-300">
                  Create a private room and invite friends!
                </p>
                <div className="flex items-center text-green-300 transition-transform duration-300 group-hover:translate-x-2">
                  <span className="font-semibold">Create Room</span>
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
                </div>
              </div>
            </Link>

            <Link
              href="/join-room"
              className="group relative overflow-hidden rounded-2xl bg-white/10 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative z-10">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-orange-500/20">
                  <svg
                    className="h-8 w-8 text-orange-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 text-2xl font-bold text-white">
                  Join Private Room
                </h3>
                <p className="mb-4 text-gray-300">
                  Join a friend&apos;s private room using their room code!
                </p>
                <div className="flex items-center text-orange-300 transition-transform duration-300 group-hover:translate-x-2">
                  <span className="font-semibold">Join Room</span>
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
                </div>
              </div>
            </Link>
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
