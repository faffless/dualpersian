"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import type { ForumCategory } from "@/lib/types";

export default function ForumsPage() {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from("forum_categories")
        .select("*, thread_count:forum_threads(count)")
        .order("sort_order", { ascending: true });

      if (data) {
        const mapped = data.map((cat: Record<string, unknown>) => ({
          ...cat,
          thread_count:
            Array.isArray(cat.thread_count) && cat.thread_count.length > 0
              ? (cat.thread_count[0] as { count: number }).count
              : 0,
        })) as ForumCategory[];
        setCategories(mapped);
      }
      setLoading(false);
    }
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="page-cream">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="font-heading text-3xl font-bold text-warm-brown flex items-center gap-2">
          Community Forums <span className="text-primary text-lg">&#x2726;</span>
        </h1>
        <p className="text-muted text-sm mt-1 mb-6">
          Connect, share, and discuss with the Persian diaspora community
        </p>

        <div className="ornament-divider mb-6">
          <span className="ornament-icon">&#x2726;</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/forums/${cat.slug}`}>
              <div className="parchment-card p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{cat.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-heading text-lg font-semibold text-warm-brown">
                      {cat.name}
                    </h2>
                    <p className="text-muted text-sm mt-1">{cat.description}</p>
                    <p className="text-xs text-muted mt-2">
                      {cat.thread_count ?? 0} {cat.thread_count === 1 ? "thread" : "threads"}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-20 text-muted">
            <p className="font-heading text-xl mb-2">No forums yet</p>
            <p className="text-sm">Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
