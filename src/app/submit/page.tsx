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
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <h1 className="text-2xl font-bold mb-2">Submit Your Project</h1>
        <p className="text-gray-500 text-sm mb-6">
          Share your project with the community and get votes!
        </p>

        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 mb-6 text-sm text-amber-900 leading-relaxed">
          <strong>Important:</strong> When posting about your project on social
          media, make sure to tag{" "}
          <strong className="text-amber-950">@CognitionAI</strong> and{" "}
          <strong className="text-amber-950">@DevinAI</strong> so your
          submission gets recognized!
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
              className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
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
              className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Link to your post about this project (Twitter/X, LinkedIn, etc.)
            </p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-md bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
          >
            {submitting ? "Submitting..." : "Submit Project"}
          </button>
        </form>
      </div>
    </div>
  );
}
