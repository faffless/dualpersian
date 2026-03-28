"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ProfileEditPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [bio, setBio] = useState("");
  const [education, setEducation] = useState("");
  const [profession, setProfession] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) { router.push("/login"); return; }
    if (!user) return;
    const fetchProfile = async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) {
        setName(data.name || ""); setAge(data.age?.toString() || ""); setGender(data.gender || "");
        setLookingFor(data.looking_for || ""); setBio(data.bio || ""); setEducation(data.education || "");
        setProfession(data.profession || ""); setHeightCm(data.height_cm?.toString() || "");
        setCity(data.city || ""); setCountry(data.country || ""); setAvatarUrl(data.avatar_url);
      } else { router.push("/onboarding"); return; }
      setLoading(false);
    };
    fetchProfile();
  }, [user, authLoading, router]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setPhotoFile(file); setPhotoPreview(URL.createObjectURL(file)); }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true); setError(""); setSuccess(false);
    try {
      let newAvatarUrl = avatarUrl;
      if (photoFile) {
        const fileExt = photoFile.name.split(".").pop();
        const filePath = `${user.id}/avatar.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from("photos").upload(filePath, photoFile, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from("photos").getPublicUrl(filePath);
        newAvatarUrl = publicUrl;
      }
      const { error: updateError } = await supabase.from("profiles").update({
        name, age: parseInt(age), gender, looking_for: lookingFor, bio, education, profession,
        height_cm: parseInt(heightCm), city, country, avatar_url: newAvatarUrl,
      }).eq("id", user.id);
      if (updateError) throw updateError;
      setAvatarUrl(newAvatarUrl); setPhotoFile(null); setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to save"); }
    setSaving(false);
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setDeleting(true);
    try {
      // Delete profile data (messages, matches, likes, blocks, reports will cascade or be orphaned)
      await supabase.from("messages").delete().eq("sender_id", user.id);
      await supabase.from("likes").delete().eq("from_user", user.id);
      await supabase.from("likes").delete().eq("to_user", user.id);
      await supabase.from("profiles").delete().eq("id", user.id);
      // Sign out
      await supabase.auth.signOut();
      router.push("/");
    } catch {
      setError("Failed to delete account. Please contact support.");
      setDeleting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="page-arch">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="profile-card p-8">
          <h1 className="font-heading text-3xl font-bold text-warm-brown mb-1 text-center">
            Profile
          </h1>
          <div className="ornament-divider mb-6">
            <span className="ornament-icon">✦</span>
          </div>

          {error && (
            <div className="bg-primary/10 text-primary px-4 py-3 rounded-lg text-sm mb-4">{error}</div>
          )}
          {success && (
            <div className="bg-accent/10 text-accent px-4 py-3 rounded-lg text-sm mb-4">Profile saved!</div>
          )}

          <div className="space-y-4">
            {/* Photo */}
            <div className="flex flex-col items-center gap-3 mb-2">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-warm-border/30 border-3 border-warm-border shadow-md"
                style={{ borderWidth: "3px" }}
              >
                {photoPreview || avatarUrl ? (
                  <img src={photoPreview || avatarUrl!} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl text-muted font-heading"
                    style={{ backgroundImage: "url('/textures/arch-cream.png')", backgroundSize: "cover" }}
                  >
                    {name?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
              </div>
              <label className="px-4 py-2 rounded-lg border-2 border-dashed border-warm-border hover:border-primary cursor-pointer transition-colors">
                <span className="text-muted text-sm">Change photo</span>
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>

            <div className="terracotta-strip rounded-full mb-2" />

            <div>
              <label className="block text-sm font-medium mb-1 text-warm-brown">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="warm-input" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1 text-warm-brown">Age</label>
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="warm-input" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-warm-brown">Height (cm)</label>
                <input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} className="warm-input" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-warm-brown">Bio</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="warm-input resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-warm-brown">Education</label>
              <input type="text" value={education} onChange={(e) => setEducation(e.target.value)} className="warm-input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-warm-brown">Profession</label>
              <input type="text" value={profession} onChange={(e) => setProfession(e.target.value)} className="warm-input" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1 text-warm-brown">City</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="warm-input" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-warm-brown">Country</label>
                <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} className="warm-input" />
              </div>
            </div>

            <div className="terracotta-strip rounded-full mt-2" />

            <button onClick={handleSave} disabled={saving} className="btn-terracotta w-full py-3">
              {saving ? "Saving..." : "Save Changes"}
            </button>

            {/* Delete Account */}
            <div className="pt-6 mt-6 border-t border-warm-border">
              <p className="text-sm text-muted mb-2">
                Want to leave? This will permanently delete your account and all your data.
              </p>
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-sm text-primary hover:underline"
                >
                  Delete my account
                </button>
              ) : (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm text-warm-brown font-medium mb-3">
                    Are you sure? This cannot be undone.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="btn-outline flex-1 py-2 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleting}
                      className="bg-primary text-white flex-1 py-2 rounded-lg text-sm font-semibold"
                    >
                      {deleting ? "Deleting..." : "Yes, delete my account"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
