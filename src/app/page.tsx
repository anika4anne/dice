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
        <div className="mb-16 text-center">
          <h1 className="mb-6 text-6xl font-black tracking-tight text-white sm:text-7xl md:text-8xl">
            <span className="text-white">🎲</span>
            <span className="text-white"> Dice</span>
            <span className="text-white"> Game</span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-300 sm:text-2xl">
            made by anika
            <br />
          </p>
        </div>

        <div className="space-y-8">
          <div className="grid w-full max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2">
            <Link href="/single-player" className="rounded-xl bg-blue-900 p-6">
              <div>
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-black">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="h-8 w-8 text-white"
                  />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-white">
                  play solo
                </h3>
                <p className="mb-4 text-gray-300">
                  wanna play against a robot? good for practice
                </p>
                <div className="flex items-center text-white">
                  <span className="font-semibold">lets play</span>
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

            <Link href="/multiplayer" className="rounded-xl bg-blue-900 p-6">
              <div>
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-black">
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="h-8 w-8 text-white"
                  />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-white">
                  play with friends
                </h3>
                <p className="mb-4 text-gray-300">
                  get your friends! up to 6 players can join
                </p>
                <div className="flex items-center text-white">
                  <span className="font-semibold">lets play</span>
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
            <Link href="/create-room" className="rounded-xl bg-blue-900 p-6">
              <div>
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-black">
                  <svg
                    className="h-8 w-8 text-white"
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
                <h3 className="mb-3 text-2xl font-bold text-white">
                  how to play
                </h3>
                <p className="mb-4 text-gray-300">
                  learn the rules and different game modes
                </p>
                <div className="flex items-center text-white">
                  <span className="font-semibold">learn more</span>
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
              className="rounded-xl bg-green-600 px-8 py-3"
            >
              <div className="flex items-center text-white">
                <span className="font-semibold">how to play</span>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="mx-4 max-w-2xl rounded-lg bg-black p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">how to play</h3>
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
                    how it works:
                  </p>
                  <div className="ml-4 space-y-1">
                    <p>• you get 3 rolls per turn (use them wisely!)</p>
                    <p>• roll to try and get better scores</p>
                    <p>
                      • end your turn when you&apos;re happy with what you got
                    </p>
                    <p>
                      • play a few rounds and whoever has the most points wins!
                    </p>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-lg font-semibold text-blue-300">
                    different ways to score:
                  </p>
                  <div className="ml-4 space-y-2">
                    <div className="border-l-2 border-blue-400 pl-3">
                      <p className="font-semibold text-blue-200">
                        classic (sum):
                      </p>
                      <p>
                        just add up all your dice! like 3+4+1+6+2 = 16 points
                      </p>
                    </div>
                    <div className="border-l-2 border-purple-400 pl-3">
                      <p className="font-semibold text-purple-200">multiply:</p>
                      <p>
                        multiply everything together! 3×4×1×6×2 = 144 points
                        (watch out for 1s!)
                      </p>
                    </div>
                    <div className="border-l-2 border-green-400 pl-3">
                      <p className="font-semibold text-green-200">highest:</p>
                      <p>only your best die counts! 3,4,1,6,2 = 6 points</p>
                    </div>
                    <div className="border-l-2 border-yellow-400 pl-3">
                      <p className="font-semibold text-yellow-200">lowest:</p>
                      <p>only your worst die counts! 3,4,1,6,2 = 1 point</p>
                    </div>
                    <div className="border-l-2 border-red-400 pl-3">
                      <p className="font-semibold text-red-200">pairs:</p>
                      <p>
                        get 10 points for each pair! two 3s = 10 points, three
                        3s = 20 points
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-lg font-semibold text-yellow-300">
                    ways to play:
                  </p>
                  <div className="ml-4 space-y-2">
                    <div className="border-l-2 border-purple-400 pl-3">
                      <p className="font-semibold text-purple-200">
                        solo mode:
                      </p>
                      <p>play against a robot! good for learning</p>
                    </div>
                    <div className="border-l-2 border-pink-400 pl-3">
                      <p className="font-semibold text-pink-200">
                        multiplayer:
                      </p>
                      <p>
                        get your friends! up to 6 players, create rooms or join
                        existing ones
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-lg font-semibold text-orange-300">
                    about the dice:
                  </p>
                  <div className="ml-4 space-y-1">
                    <p>• pick from 4-sided all the way up to 20-sided dice</p>
                    <p>• more sides = bigger possible scores (duh!)</p>
                    <p>• 6-sided is the classic choice, but try others!</p>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-lg font-semibold text-green-300">
                    pro tips:
                  </p>
                  <div className="ml-4 space-y-1">
                    <p>• classic mode: just go for high numbers</p>
                    <p>• multiply mode: 1s are your enemy! try to avoid them</p>
                    <p>• pairs mode: matching numbers are your friend</p>
                    <p>
                      • don&apos;t waste all 3 rolls if you already got
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
