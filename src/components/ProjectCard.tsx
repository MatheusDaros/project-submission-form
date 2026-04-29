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

  return (
    <div className="flex items-start gap-4 p-5 border border-gray-200 rounded-xl bg-white hover:shadow-sm transition-shadow">
      <div
        className={`shrink-0 w-12 text-center text-sm font-bold pt-0.5 ${isTop3 ? "text-amber-500 text-base" : "text-gray-400"}`}
      >
        #{rank}
        {medal && <span className="ml-0.5">{medal}</span>}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-gray-900 break-words">
          {project.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1 leading-relaxed break-words">
          {project.description}
        </p>
        {isValidHttpUrl(project.social_media_link) && (
          <a
            href={project.social_media_link!}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline font-medium mt-1 inline-block"
          >
            View Social Media Post &rarr;
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
