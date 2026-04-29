import { Leaderboard } from "@/components/Leaderboard";

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-primary-800 via-primary-600 to-accent-500 bg-clip-text text-transparent mb-3 leading-tight">
          Project Showcase
        </h1>
        <p className="text-gray-500 text-lg max-w-md mx-auto">
          Submit your project, vote for others, and climb the leaderboard!
        </p>
      </div>

      <div className="glass rounded-2xl shadow-lg shadow-primary-500/5 border border-white/60 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">🏅</span>
          <h2 className="text-xl font-bold text-gray-900">Leaderboard</h2>
        </div>
        <p className="text-sm text-gray-500 mb-6 ml-10">
          Vote for the projects you love! Each person gets one vote per project.
        </p>
        <Leaderboard />
      </div>
    </div>
  );
}
