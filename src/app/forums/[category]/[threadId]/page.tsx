"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { ForumThread, ForumReply } from "@/lib/types";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

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

type AuthorInfo = { name: string; avatar_url: string | null };

export default function ThreadPage() {
  const params = useParams();
  const categorySlug = params.category as string;
  const threadId = params.threadId as string;
  const { user } = useAuth();

  const [thread, setThread] = useState<ForumThread | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    async function fetchData() {
      // Fetch thread
      const { data: threadData } = await supabase
        .from("forum_threads")
        .select("*, author:profiles(name, avatar_url), category:forum_categories(name, slug)")
        .eq("id", threadId)
        .single();

      if (!threadData) {
        setLoading(false);
        return;
      }

      setThread(threadData as unknown as ForumThread);
      const cat = threadData.category as unknown as { name: string; slug: string } | null;
      setCategoryName(cat?.name ?? "");

      // Fetch replies
      const { data: replyData } = await supabase
        .from("forum_replies")
        .select("*, author:profiles(name, avatar_url)")
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true });

      if (replyData) {
        setReplies(replyData as unknown as ForumReply[]);
      }
      setLoading(false);
    }
    fetchData();
  }, [threadId]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !replyContent.trim()) return;
    setSubmitting(true);

    const { data, error } = await supabase
      .from("forum_replies")
      .insert({
        thread_id: threadId,
        author_id: user.id,
        content: replyContent.trim(),
      })
      .select("*, author:profiles(name, avatar_url)")
      .single();

    if (!error && data) {
      setReplies([...replies, data as unknown as ForumReply]);
      setReplyContent("");

      // Update reply count and last_reply_at on the thread
      await supabase
        .from("forum_threads")
        .update({
          reply_count: (thread?.reply_count ?? 0) + 1,
          last_reply_at: new Date().toISOString(),
        })
        .eq("id", threadId);
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

  if (!thread) {
    return (
      <div className="page-cream">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center">
          <p className="font-heading text-xl text-warm-brown">Thread not found</p>
          <Link href="/forums" className="text-primary text-sm mt-2 inline-block">
            Back to Forums
          </Link>
        </div>
      </div>
    );
  }

  const threadAuthor = thread.author as unknown as AuthorInfo | null;

  return (
    <div className="page-cream">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="text-sm text-muted mb-4">
          <Link href="/forums" className="hover:text-warm-brown">Forums</Link>
          <span className="mx-2">/</span>
          <Link href={`/forums/${categorySlug}`} className="hover:text-warm-brown">
            {categoryName}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-warm-brown truncate">{thread.title}</span>
        </div>

        {/* Original post */}
        <div className="parchment-card p-6 mb-6">
          <h1 className="font-heading text-2xl font-bold text-warm-brown mb-2">
            {thread.title}
          </h1>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-warm-border/40 flex items-center justify-center text-sm font-heading text-warm-brown">
              {threadAuthor?.avatar_url ? (
                <img
                  src={threadAuthor.avatar_url}
                  alt={threadAuthor.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                threadAuthor?.name?.[0]?.toUpperCase() ?? "?"
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-warm-brown">
                {threadAuthor?.name ?? "Unknown"}
              </p>
              <p className="text-xs text-muted">{formatDate(thread.created_at)}</p>
            </div>
          </div>
          <div className="ornament-divider mb-4">
            <span className="ornament-icon">&#x2726;</span>
          </div>
          <div className="text-sm text-warm-brown leading-relaxed whitespace-pre-wrap">
            {thread.content}
          </div>
        </div>

        {/* Replies */}
        <h2 className="font-heading text-lg font-semibold text-warm-brown mb-4">
          {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
        </h2>

        <div className="space-y-4 mb-8">
          {replies.map((reply) => {
            const replyAuthor = reply.author as unknown as AuthorInfo | null;
            return (
              <div key={reply.id} className="parchment-card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-7 h-7 rounded-full bg-warm-border/40 flex items-center justify-center text-xs font-heading text-warm-brown">
                    {replyAuthor?.avatar_url ? (
                      <img
                        src={replyAuthor.avatar_url}
                        alt={replyAuthor.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      replyAuthor?.name?.[0]?.toUpperCase() ?? "?"
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-warm-brown">
                      {replyAuthor?.name ?? "Unknown"}
                    </p>
                    <p className="text-xs text-muted">{timeAgo(reply.created_at)}</p>
                  </div>
                </div>
                <div className="text-sm text-warm-brown leading-relaxed whitespace-pre-wrap">
                  {reply.content}
                </div>
              </div>
            );
          })}

          {replies.length === 0 && (
            <p className="text-center text-muted text-sm py-8">
              No replies yet. Be the first to respond!
            </p>
          )}
        </div>

        {/* Reply form */}
        {user ? (
          <form onSubmit={handleReply} className="parchment-card p-6">
            <h3 className="font-heading text-lg font-semibold text-warm-brown mb-3">
              Write a Reply
            </h3>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="warm-input w-full h-28 resize-y mb-4"
              placeholder="Share your thoughts..."
              required
            />
            <button
              type="submit"
              disabled={submitting}
              className="btn-terracotta text-sm px-6 py-2"
            >
              {submitting ? "Posting..." : "Post Reply"}
            </button>
          </form>
        ) : (
          <div className="parchment-card p-6 text-center">
            <p className="text-muted text-sm mb-3">Sign in to join the conversation</p>
            <Link href="/login" className="btn-terracotta text-sm px-6 py-2 inline-block">
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
