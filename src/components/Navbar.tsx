"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";

export function Navbar() {
  const { user, signOut, loading } = useAuth();

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/40 shadow-sm">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl" role="img" aria-label="trophy">
            🏆
          </span>
          <span className="text-lg font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent group-hover:from-primary-600 group-hover:to-accent-500 transition-all">
            Project Showcase
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {loading ? null : user ? (
            <>
              <Link
                href="/submit"
                className="text-sm font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 shadow-md shadow-primary-500/20 transition-all hover:shadow-lg hover:shadow-primary-500/30"
              >
                + Submit Project
              </Link>
              <span className="text-sm text-gray-500 hidden sm:inline max-w-[160px] truncate">
                {user.email}
              </span>
              <button
                onClick={signOut}
                className="text-sm px-3 py-1.5 rounded-full border border-gray-300 text-gray-600 hover:bg-white/80 hover:border-gray-400 transition-all cursor-pointer"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm font-semibold px-5 py-2 rounded-full bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 shadow-md shadow-primary-500/20 transition-all hover:shadow-lg hover:shadow-primary-500/30"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
