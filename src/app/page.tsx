import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-pink-900">
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="mb-6 text-6xl font-black tracking-tight text-white sm:text-7xl md:text-8xl">
            <span className="text-white">Dice</span>
            <span className="text-white"> Game</span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-300 sm:text-2xl">
            Roll the dice and test your luck! Challenge yourself or play with
            friends in this exciting dice game.
          </p>
        </div>

        {/* Game modes */}
        <div className="grid w-full max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2">
          {/* Single Player Card */}
          <Link
            href="/single-player"
            className="group relative overflow-hidden rounded-2xl bg-white/10 p-8 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="relative z-10">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-purple-500/20">
                <svg
                  className="h-8 w-8 text-purple-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-bold text-white">
                Single Player
              </h3>
              <p className="mb-4 text-gray-300">
                Challenge yourself against an AI opponent. Perfect for quick
                games and practice!
              </p>
              <div className="flex items-center text-purple-300 transition-transform duration-300 group-hover:translate-x-2">
                <span className="font-semibold">Start Game</span>
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

          {/* Multiplayer Card */}
          <Link
            href="#"
            className="group relative overflow-hidden rounded-2xl bg-white/10 p-8 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-indigo-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="relative z-10">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-pink-500/20">
                <svg
                  className="h-8 w-8 text-pink-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-bold text-white">
                Multiplayer
              </h3>
              <p className="mb-4 text-gray-300">
                Play with friends! Up to 6 players can join and compete for the
                highest score.
              </p>
              <div className="flex items-center text-pink-300 transition-transform duration-300 group-hover:translate-x-2">
                <span className="font-semibold">Coming Soon</span>
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
