import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUsers } from "@fortawesome/free-solid-svg-icons";

export default function HomePage() {
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
              className="group relative overflow-hidden rounded-2xl bg-white/10 p-8 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20"
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
              className="group relative overflow-hidden rounded-2xl bg-white/10 p-8 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20"
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
              className="group relative overflow-hidden rounded-2xl bg-white/10 p-8 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20"
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
                  Create a private room and invite friends with a unique code!
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
              className="group relative overflow-hidden rounded-2xl bg-white/10 p-8 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20"
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
                  Join a friend&apos;s private room using their unique room
                  code!
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
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-gray-400">Lemme know what you think!</p>
          <p className="mt-2 text-xs text-gray-500">
            Email me at anika4dev@gmail.com
          </p>
        </div>
      </div>
    </main>
  );
}
