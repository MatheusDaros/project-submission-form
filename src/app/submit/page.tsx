"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";

export default function SubmitPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [socialLink, setSocialLink] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && !user) {
    router.push("/login");
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }
    if (!description.trim()) {
      setError("Description is required.");
      return;
    }

    setSubmitting(true);

    try {
      const { error: insertError } = await supabase.from("projects").insert({
        name: name.trim(),
        description: description.trim(),
        social_media_link: socialLink.trim() || null,
        user_id: user!.id,
      });

      if (insertError) throw insertError;

      setSuccess("Project submitted successfully!");
      setName("");
      setDescription("");
      setSocialLink("");

      setTimeout(() => router.push("/"), 1500);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to submit project.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="glass rounded-2xl shadow-xl shadow-primary-500/10 border border-white/60 p-6 sm:p-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🚀</span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
              Submit Your Project
            </h1>
          </div>
          <p className="text-gray-500 text-sm ml-12">
            Share your project with the community and get votes!
          </p>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-xl p-4 mb-6 text-sm text-amber-900 leading-relaxed">
          <div className="flex items-start gap-2">
            <span className="text-lg leading-none mt-0.5">📢</span>
            <div>
              <strong>Tip:</strong> When posting about your project on social
              media, tag{" "}
              <strong className="text-amber-950">@CognitionAI</strong> and{" "}
              <strong className="text-amber-950">@DevinAI</strong> so your
              submission gets recognized!
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="project-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              id="project-name"
              type="text"
              required
              maxLength={150}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Project"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              required
              maxLength={1000}
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what your project does and why it's great..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 resize-y transition-all"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">
              {description.length} / 1000
            </p>
          </div>

          <div>
            <label
              htmlFor="social-link"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Social Media Post Link
            </label>
            <input
              id="social-link"
              type="url"
              value={socialLink}
              onChange={(e) => setSocialLink(e.target.value)}
              placeholder="https://twitter.com/you/status/..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all"
            />
            <p className="text-xs text-gray-400 mt-1">
              Link to your post about this project (Twitter/X, LinkedIn, etc.)
            </p>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          {success && (
            <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-sm hover:from-primary-500 hover:to-primary-400 shadow-md shadow-primary-500/20 disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-none disabled:cursor-not-allowed cursor-pointer transition-all"
          >
            {submitting ? "Submitting..." : "Submit Project"}
          </button>
        </form>
      </div>
    </div>
  );
}
