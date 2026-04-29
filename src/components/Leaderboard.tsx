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
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select(
            "id, name, description, social_media_link, user_id, created_at"
          );
        if (projectError) throw projectError;
        if (cancelled) return;

        if (!projectData || projectData.length === 0) {
          setProjects([]);
          setLoading(false);
          return;
        }

        const { data: allVotes, error: votesError } = await supabase
          .from("votes")
          .select("project_id, user_id");
        if (votesError) throw votesError;
        if (cancelled) return;

        const countMap: Record<string, number> = {};
        const currentUserVotes = new Set<string>();

        (allVotes ?? []).forEach(
          (v: { project_id: string; user_id: string }) => {
            countMap[v.project_id] = (countMap[v.project_id] || 0) + 1;
            if (userId && v.user_id === userId) {
              currentUserVotes.add(v.project_id);
            }
          }
        );

        const enriched: Project[] = projectData.map((p) => ({
          ...p,
          vote_count: countMap[p.id] || 0,
        }));
        enriched.sort((a, b) => (b.vote_count ?? 0) - (a.vote_count ?? 0));

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
          key={project.id}
          project={project}
          rank={index + 1}
          voted={userVotes.has(project.id)}
          isOwnProject={user?.id === project.user_id}
        />
      ))}
    </div>
  );
}
