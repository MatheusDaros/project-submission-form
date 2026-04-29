"use client";

import type { Project } from "@/lib/types";
import { VoteButton } from "./VoteButton";

interface ProjectCardProps {
  project: Project;
  rank: number;
  voted: boolean;
  isOwnProject: boolean;
}

const MEDAL: Record<number, string> = {
  1: "🥇",
  2: "🥈",
  3: "🥉",
};

const RANK_STYLES: Record<number, string> = {
  1: "from-amber-400 to-yellow-500 text-white shadow-amber-400/30",
  2: "from-gray-300 to-gray-400 text-white shadow-gray-400/20",
  3: "from-amber-600 to-amber-700 text-white shadow-amber-600/20",
};

function isValidHttpUrl(str: string | null): boolean {
  if (!str) return false;
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function ProjectCard({
  project,
  rank,
  voted,
  isOwnProject,
}: ProjectCardProps) {
  const medal = MEDAL[rank] ?? "";
  const isTop3 = rank <= 3;
  const rankStyle = RANK_STYLES[rank];

  return (
    <div
      className={`group flex items-start gap-4 p-5 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 ${
        isTop3
          ? "bg-white/90 border-primary-200/60 shadow-md hover:shadow-lg"
          : "bg-white/70 border-white/60 shadow-sm hover:shadow-md hover:bg-white/90"
      }`}
    >
      <div className="shrink-0 flex flex-col items-center gap-1 pt-0.5">
        {rankStyle ? (
          <div
            className={`w-9 h-9 rounded-full bg-gradient-to-br ${rankStyle} flex items-center justify-center text-sm font-bold shadow-md`}
          >
            {rank}
          </div>
        ) : (
          <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-400">
            {rank}
          </div>
        )}
        {medal && (
          <span className="text-lg leading-none animate-float">{medal}</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-gray-900 break-words group-hover:text-primary-700 transition-colors">
          {project.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1 leading-relaxed break-words line-clamp-3">
          {project.description}
        </p>
        {isValidHttpUrl(project.social_media_link) && (
          <a
            href={project.social_media_link!}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-800 font-medium mt-2 transition-colors"
          >
            View Post
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        )}
      </div>

      <VoteButton
        projectId={project.id}
        initialCount={project.vote_count ?? 0}
        initialVoted={voted}
        isOwnProject={isOwnProject}
      />
    </div>
  );
}
