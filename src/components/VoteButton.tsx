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
      className={`flex flex-col items-center gap-0.5 px-3 py-2.5 rounded-xl border text-sm min-w-[56px] transition-all duration-200 cursor-pointer
        ${
          voted
            ? "border-primary-400 bg-primary-50 text-primary-700 shadow-sm shadow-primary-400/20 scale-105"
            : "border-gray-200 bg-white/60 text-gray-400 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600 hover:shadow-sm"
        }
        ${disabled && !voted ? "opacity-40 cursor-not-allowed hover:border-gray-200 hover:bg-white/60 hover:text-gray-400 hover:shadow-none" : ""}
      `}
    >
      <svg
        className={`w-4 h-4 transition-transform ${voted ? "scale-110" : ""}`}
        fill={voted ? "currentColor" : "none"}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M5 15l7-7 7 7"
        />
      </svg>
      <span className="font-bold text-sm">{count}</span>
    </button>
  );
}
