import { Leaderboard } from "@/components/Leaderboard";

export default function HomePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
          Project Showcase
        </h1>
        <p className="text-gray-500">
          Submit your project, vote for others, and climb the leaderboard!
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold mb-1">Leaderboard</h2>
        <p className="text-sm text-gray-500 mb-5">
          Vote for the projects you love! Each person gets one vote per project.
        </p>
        <Leaderboard />
      </div>
    </div>
  );
}
