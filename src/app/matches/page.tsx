"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import type { Profile } from "@/lib/types";
import Link from "next/link";

type MatchWithProfile = { matchId: string; profile: Profile; createdAt: string };

export default function MatchesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [matches, setMatches] = useState<MatchWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) { router.push("/login"); return; }
    if (!user) return;
    const fetchMatches = async () => {
      const { data: matchData } = await supabase.from("matches").select("*").or(`user1.eq.${user.id},user2.eq.${user.id}`).order("created_at", { ascending: false });
      if (!matchData || matchData.length === 0) { setMatches([]); setLoading(false); return; }
      const otherUserIds = matchData.map((m) => m.user1 === user.id ? m.user2 : m.user1);
      const { data: profiles } = await supabase.from("profiles").select("*").in("id", otherUserIds);
      const profileMap = new Map((profiles || []).map((p) => [p.id, p]));
      const enriched: MatchWithProfile[] = matchData.map((m) => {
        const otherId = m.user1 === user.id ? m.user2 : m.user1;
        const profile = profileMap.get(otherId);
        if (!profile) return null;
        return { matchId: m.id, profile, createdAt: m.created_at };
      }).filter(Boolean) as MatchWithProfile[];
      setMatches(enriched);
      setLoading(false);
    };
    fetchMatches();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="page-cream">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="font-heading text-3xl font-bold text-warm-brown mb-2 flex items-center gap-2">
          Your Matches <span className="text-primary text-lg">✦</span>
        </h1>
        <div className="ornament-divider mb-6">
          <span className="ornament-icon">✦</span>
        </div>

        {matches.length === 0 ? (
          <div className="parchment-card p-12 text-center text-muted">
            <p className="font-heading text-xl mb-2">No matches yet</p>
            <p className="text-sm mb-6">
              Keep browsing and liking profiles — when someone likes you back, they will appear here.
            </p>
            <Link href="/discover" className="btn-terracotta inline-block">Discover People</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {matches.map(({ matchId, profile }) => (
              <Link key={matchId} href={`/chat/${matchId}`} className="parchment-card overflow-hidden">
                <div className="aspect-[3/4] bg-warm-border/30 relative">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-muted font-heading"
                      style={{ backgroundImage: "url('/textures/arch-cream.png')", backgroundSize: "cover", backgroundPosition: "center" }}
                    >
                      {profile.name?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-heading font-semibold truncate text-warm-brown">{profile.name}, {profile.age}</p>
                  <p className="text-sm text-muted truncate">{profile.city}</p>
                  <p className="text-xs text-primary font-medium mt-1">Send a message →</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
