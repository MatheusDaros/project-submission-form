"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthProvider";
import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/lib/types";

export function Leaderboard() {
  const { user } = useAuth();
  const userId = user?.id;
  const [projects, setProjects] = useState<Project[]>([]);
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setError("");
      setLoading(true);

      try {
        // Use server-side RPC to get projects with vote counts (no row limit issue)
        const { data: projectData, error: rpcError } = await supabase.rpc(
          "get_projects_with_votes"
        );

        if (rpcError) throw rpcError;
        if (cancelled) return;

        if (!projectData || projectData.length === 0) {
          setProjects([]);
          setLoading(false);
          return;
        }

        const enriched: Project[] = (
          projectData as Array<Project & { vote_count: number }>
        ).map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          social_media_link: p.social_media_link,
          user_id: p.user_id,
          created_at: p.created_at,
          vote_count: Number(p.vote_count) || 0,
        }));

        // Fetch current user's votes (bounded by number of projects, not total votes)
        const currentUserVotes = new Set<string>();
        if (userId) {
          const { data: myVotes } = await supabase
            .from("votes")
            .select("project_id")
            .eq("user_id", userId);
          if (!cancelled && myVotes) {
            myVotes.forEach((v: { project_id: string }) =>
              currentUserVotes.add(v.project_id)
            );
          }
        }
        if (cancelled) return;

        setProjects(enriched);
        setUserVotes(currentUserVotes);
      } catch (err) {
        if (!cancelled) {
          console.error("Leaderboard error:", err);
          setError("Failed to load projects. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 py-16">
        <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-3">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-primary-600 hover:text-primary-800 font-medium cursor-pointer"
        >
          Try again
        </button>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="text-5xl block mb-4">🎯</span>
        <p className="text-gray-500 font-medium mb-1">
          No projects submitted yet
        </p>
        <p className="text-sm text-gray-400">
          Be the first to share your project!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {projects.map((project, index) => (
        <ProjectCard
          key={`${project.id}-${userId ?? "anon"}`}
          project={project}
          rank={index + 1}
          voted={userVotes.has(project.id)}
          isOwnProject={user?.id === project.user_id}
        />
      ))}
    </div>
  );
}
