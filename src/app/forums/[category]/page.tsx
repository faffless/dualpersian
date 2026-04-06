"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { ForumCategory, ForumThread } from "@/lib/types";

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.category as string;
  const { user } = useAuth();

  const [category, setCategory] = useState<ForumCategory | null>(null);
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const { data: cat } = await supabase
        .from("forum_categories")
        .select("*")
        .eq("slug", slug)
        .single();

      if (!cat) {
        setLoading(false);
        return;
      }
      setCategory(cat);

      const { data: threadData } = await supabase
        .from("forum_threads")
        .select("*, author:profiles(name, avatar_url)")
        .eq("category_id", cat.id)
        .order("is_pinned", { ascending: false })
        .order("last_reply_at", { ascending: false });

      if (threadData) {
        setThreads(threadData as unknown as ForumThread[]);
      }
      setLoading(false);
    }
    fetchData();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !category || !title.trim() || !content.trim()) return;
    setSubmitting(true);

    const { data, error } = await supabase
      .from("forum_threads")
      .insert({
        category_id: category.id,
        author_id: user.id,
        title: title.trim(),
        content: content.trim(),
      })
      .select("*, author:profiles(name, avatar_url)")
      .single();

    if (!error && data) {
      setThreads([data as unknown as ForumThread, ...threads]);
      setTitle("");
      setContent("");
      setShowForm(false);
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="page-cream">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center">
          <p className="font-heading text-xl text-warm-brown">Category not found</p>
          <Link href="/forums" className="text-primary text-sm mt-2 inline-block">
            Back to Forums
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-cream">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="text-sm text-muted mb-4">
          <Link href="/forums" className="hover:text-warm-brown">Forums</Link>
          <span className="mx-2">/</span>
          <span className="text-warm-brown">{category.name}</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{category.icon}</span>
            <div>
              <h1 className="font-heading text-3xl font-bold text-warm-brown">
                {category.name}
              </h1>
              <p className="text-muted text-sm">{category.description}</p>
            </div>
          </div>
          {user && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-terracotta text-sm px-4 py-2"
            >
              {showForm ? "Cancel" : "+ New Thread"}
            </button>
          )}
        </div>

        <div className="ornament-divider mb-6">
          <span className="ornament-icon">&#x2726;</span>
        </div>

        {/* New thread form */}
        {showForm && user && (
          <form onSubmit={handleSubmit} className="parchment-card p-6 mb-6">
            <h2 className="font-heading text-lg font-semibold text-warm-brown mb-4">
              Start a New Thread
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="warm-input w-full"
                  placeholder="Thread title..."
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted mb-1">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="warm-input w-full h-32 resize-y"
                  placeholder="What's on your mind?"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="btn-terracotta text-sm px-6 py-2"
              >
                {submitting ? "Posting..." : "Post Thread"}
              </button>
            </div>
          </form>
        )}

        {/* Thread list */}
        <div className="space-y-3">
          {threads.map((thread) => {
            const author = thread.author as unknown as { name: string; avatar_url: string | null } | null;
            return (
              <Link key={thread.id} href={`/forums/${slug}/${thread.id}`}>
                <div className="parchment-card p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {thread.is_pinned && (
                          <span className="text-xs bg-warm-border/40 text-warm-brown px-2 py-0.5 rounded-full">
                            Pinned
                          </span>
                        )}
                        <h3 className="font-heading font-semibold text-warm-brown truncate">
                          {thread.title}
                        </h3>
                      </div>
                      <p className="text-xs text-muted mt-1">
                        by {author?.name ?? "Unknown"} &middot; {timeAgo(thread.created_at)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-medium text-warm-brown">
                        {thread.reply_count ?? 0}
                      </span>
                      <p className="text-xs text-muted">
                        {thread.reply_count === 1 ? "reply" : "replies"}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {threads.length === 0 && (
          <div className="text-center py-16 text-muted">
            <p className="font-heading text-xl mb-2">No threads yet</p>
            <p className="text-sm">Be the first to start a discussion!</p>
          </div>
        )}
      </div>
    </div>
  );
}
