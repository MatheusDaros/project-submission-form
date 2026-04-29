"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";

export function Navbar() {
  const { user, signOut, loading } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900">
          Project Showcase
        </Link>

        <div className="flex items-center gap-4">
          {loading ? null : user ? (
            <>
              <Link
                href="/submit"
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Submit Project
              </Link>
              <span className="text-sm text-gray-500 hidden sm:inline">
                {user.email}
              </span>
              <button
                onClick={signOut}
                className="text-sm px-3 py-1.5 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 font-medium"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
