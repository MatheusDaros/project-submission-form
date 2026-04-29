"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthProvider";

interface VoteButtonProps {
  projectId: string;
  initialCount: number;
  initialVoted: boolean;
  isOwnProject: boolean;
}

export function VoteButton({
  projectId,
  initialCount,
  initialVoted,
  isOwnProject,
}: VoteButtonProps) {
  const { user } = useAuth();
  const [voted, setVoted] = useState(initialVoted);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function toggleVote() {
    if (!user || isOwnProject) return;
    setLoading(true);

    try {
      if (voted) {
        const { error } = await supabase
          .from("votes")
          .delete()
          .eq("project_id", projectId)
          .eq("user_id", user.id);
        if (error) throw error;
        setVoted(false);
        setCount((c) => c - 1);
      } else {
        const { error } = await supabase
          .from("votes")
          .insert({ project_id: projectId, user_id: user.id });
        if (error) throw error;
        setVoted(true);
        setCount((c) => c + 1);
      }
    } catch (err) {
      console.error("Vote error:", err);
    } finally {
      setLoading(false);
    }
  }

  const disabled = loading || !user || isOwnProject;

  return (
    <button
      onClick={toggleVote}
      disabled={disabled}
      title={
        isOwnProject
          ? "You cannot vote for your own project"
          : !user
            ? "Sign in to vote"
            : voted
              ? "Remove vote"
              : "Upvote this project"
      }
      className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg border text-sm min-w-[52px] transition-all cursor-pointer
        ${
          voted
            ? "border-violet-500 bg-violet-50 text-violet-700"
            : "border-gray-200 bg-gray-50 text-gray-500 hover:border-violet-400 hover:bg-violet-50"
        }
        ${disabled && !voted ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <span className="text-base leading-none">{voted ? "▲" : "△"}</span>
      <span className="font-bold">{count}</span>
    </button>
  );
}
