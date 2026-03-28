"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import type { Profile } from "@/lib/types";
import ReportBlockMenu from "@/components/ReportBlockMenu";

export default function DiscoverPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [likesRemaining, setLikesRemaining] = useState<number>(10);
  const [isPremium, setIsPremium] = useState(false);
  const [filters, setFilters] = useState({ minAge: 18, maxAge: 99, city: "" });
  const [showFilters, setShowFilters] = useState(false);

  const fetchProfiles = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data: myProfile } = await supabase
      .from("profiles")
      .select("looking_for, is_premium, daily_likes_used, daily_likes_reset_at")
      .eq("id", user.id)
      .single();

    if (myProfile) {
      setIsPremium(myProfile.is_premium);
      const resetAt = new Date(myProfile.daily_likes_reset_at);
      const now = new Date();
      if (now.getTime() - resetAt.getTime() > 24 * 60 * 60 * 1000) {
        await supabase.from("profiles").update({ daily_likes_used: 0, daily_likes_reset_at: now.toISOString() }).eq("id", user.id);
        setLikesRemaining(10);
      } else {
        setLikesRemaining(10 - (myProfile.daily_likes_used || 0));
      }
    }
    const { data: alreadyLiked } = await supabase.from("likes").select("to_user").eq("from_user", user.id);
    const likedSet = new Set((alreadyLiked || []).map((l) => l.to_user));
    setLikedIds(likedSet);

    // Get blocked user IDs
    const { data: blockedData } = await supabase.from("blocks").select("blocked_user_id").eq("blocker_id", user.id);
    const blockedSet = new Set((blockedData || []).map((b) => b.blocked_user_id));

    let query = supabase.from("profiles").select("*").neq("id", user.id).gte("age", filters.minAge).lte("age", filters.maxAge).order("created_at", { ascending: false }).limit(50);
    if (myProfile?.looking_for && myProfile.looking_for !== "Everyone") {
      query = query.eq("gender", myProfile.looking_for === "Men" ? "Man" : "Woman");
    }
    if (filters.city) query = query.ilike("city", `%${filters.city}%`);
    const { data } = await query;
    setProfiles((data || []).filter((p) => !likedSet.has(p.id) && !blockedSet.has(p.id)));
    setLoading(false);
  }, [user, filters]);

  useEffect(() => {
    if (!authLoading && !user) { router.push("/login"); return; }
    if (user) fetchProfiles();
  }, [user, authLoading, router, fetchProfiles]);

  const handleLike = async (profileId: string) => {
    if (!user) return;
    if (!isPremium && likesRemaining <= 0) { alert("You've used all 10 likes for today!"); return; }
    const { error } = await supabase.from("likes").insert({ from_user: user.id, to_user: profileId });
    if (error) return;
    if (!isPremium) {
      await supabase.from("profiles").update({ daily_likes_used: 10 - likesRemaining + 1 }).eq("id", user.id);
      setLikesRemaining((prev) => prev - 1);
    }
    const { data: mutualLike } = await supabase.from("likes").select("id").eq("from_user", profileId).eq("to_user", user.id).single();
    if (mutualLike) {
      await supabase.from("matches").insert({ user1: user.id, user2: profileId });
      alert("It's a match! 🎉");
    }
    setProfiles((prev) => prev.filter((p) => p.id !== profileId));
    setLikedIds((prev) => new Set(prev).add(profileId));
    setSelectedProfile(null);
  };

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
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-3xl font-bold text-warm-brown flex items-center gap-2">
              Discover <span className="text-primary text-lg">✦</span>
            </h1>
            {!isPremium && (
              <p className="text-sm text-muted">{likesRemaining} likes remaining today</p>
            )}
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="btn-outline text-sm px-4 py-2">
            ✦ Filter
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="parchment-card p-4 mb-6 flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Min Age</label>
              <input type="number" value={filters.minAge} onChange={(e) => setFilters({ ...filters, minAge: parseInt(e.target.value) || 18 })} min="18" className="warm-input w-20" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">Max Age</label>
              <input type="number" value={filters.maxAge} onChange={(e) => setFilters({ ...filters, maxAge: parseInt(e.target.value) || 99 })} max="99" className="warm-input w-20" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted mb-1">City</label>
              <input type="text" value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} className="warm-input w-40" placeholder="Any city" />
            </div>
            <button onClick={fetchProfiles} className="btn-terracotta text-sm px-4 py-2">Apply</button>
          </div>
        )}

        {/* Ornament divider */}
        <div className="ornament-divider mb-6">
          <span className="ornament-icon">✦</span>
        </div>

        {/* Grid */}
        {profiles.length === 0 ? (
          <div className="text-center py-20 text-muted">
            <p className="font-heading text-xl mb-2">No more profiles to show</p>
            <p className="text-sm">Check back later or adjust your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {profiles.map((profile) => (
              <button
                key={profile.id}
                onClick={() => setSelectedProfile(profile)}
                className="parchment-card overflow-hidden text-left"
              >
                <div className="aspect-[3/4] bg-warm-border/30 relative pointer-events-none">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-muted font-heading"
                      style={{
                        backgroundImage: "url('/textures/arch-cream.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {profile.name?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}
                </div>
                <div className="p-3 pointer-events-none">
                  <p className="font-heading font-semibold truncate text-warm-brown">
                    {profile.name}, {profile.age}
                  </p>
                  <p className="text-sm text-muted truncate">{profile.profession}</p>
                  <p className="text-xs text-muted truncate">{profile.city}, {profile.country}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Profile Modal */}
        {selectedProfile && (
          <div className="fixed inset-0 bg-warm-brown/60 flex items-center justify-center z-50 p-4">
            <div className="modal-parchment rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-warm-border">
              <div className="aspect-square bg-warm-border/30 relative rounded-t-2xl overflow-hidden">
                {selectedProfile.avatar_url ? (
                  <img src={selectedProfile.avatar_url} alt={selectedProfile.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl text-muted font-heading"
                    style={{
                      backgroundImage: "url('/textures/arch-cream.png')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {selectedProfile.name?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="absolute top-3 right-3 bg-warm-brown/50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-warm-brown/70"
                >
                  ✕
                </button>
              </div>
              {/* Terracotta strip between photo and info */}
              <div className="terracotta-strip" />
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-heading text-2xl font-bold mb-1 text-warm-brown">
                      {selectedProfile.name}, {selectedProfile.age}
                    </h2>
                    <p className="text-muted mb-4">{selectedProfile.city}, {selectedProfile.country}</p>
                  </div>
                  <ReportBlockMenu
                    targetUserId={selectedProfile.id}
                    targetUserName={selectedProfile.name}
                    onBlock={() => {
                      setProfiles((prev) => prev.filter((p) => p.id !== selectedProfile.id));
                      setSelectedProfile(null);
                    }}
                  />
                </div>

                <div className="ornament-divider mb-4">
                  <span className="ornament-icon">✦</span>
                </div>

                <div className="space-y-3 mb-6">
                  {[
                    { label: "Profession", value: selectedProfile.profession },
                    { label: "Education", value: selectedProfile.education },
                    { label: "Height", value: `${selectedProfile.height_cm} cm` },
                  ].map((item) => (
                    <div key={item.label} className="flex gap-2">
                      <span className="text-sm font-medium text-muted w-24">{item.label}</span>
                      <span className="text-sm text-warm-brown">{item.value}</span>
                    </div>
                  ))}
                  {selectedProfile.bio && (
                    <div>
                      <span className="text-sm font-medium text-muted">About</span>
                      <p className="text-sm mt-1 text-warm-brown italic">{selectedProfile.bio}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setSelectedProfile(null)} className="btn-outline flex-1 py-3">Pass</button>
                  <button onClick={() => handleLike(selectedProfile.id)} className="btn-terracotta flex-1 py-3">♥ Like</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
