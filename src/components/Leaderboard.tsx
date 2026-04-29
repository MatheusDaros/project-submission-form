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
      <p className="text-center text-gray-400 py-12">Loading projects...</p>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 py-12">{error}</p>;
  }

  if (projects.length === 0) {
    return (
      <p className="text-center text-gray-400 py-12">
        No projects submitted yet. Be the first!
      </p>
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
