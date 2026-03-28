"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";

const GENDER_OPTIONS = ["Man", "Woman"];
const LOOKING_FOR_OPTIONS = ["Men", "Women", "Everyone"];

export default function OnboardingPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => { if (!authLoading && !user) router.push("/login"); }, [user, authLoading, router]);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`);
          const data = await res.json();
          if (data.city) setCity(data.city);
          if (data.countryName) setCountry(data.countryName);
        } catch {}
      }, () => {});
    }
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setPhotoFile(file); setPhotoPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true); setError("");
    try {
      let avatarUrl: string | null = null;
      if (photoFile) {
        const fileExt = photoFile.name.split(".").pop();
        const filePath = `${user.id}/avatar.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from("photos").upload(filePath, photoFile, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from("photos").getPublicUrl(filePath);
        avatarUrl = publicUrl;
      }
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id, name, age: parseInt(age), gender, looking_for: lookingFor, bio, education, profession,
        height_cm: parseInt(heightCm), city, country, avatar_url: avatarUrl, is_premium: false, daily_likes_used: 0,
        daily_likes_reset_at: new Date().toISOString(),
      });
      if (profileError) throw profileError;
      router.push("/discover");
    } catch (err) { setError(err instanceof Error ? err.message : "Something went wrong"); setLoading(false); }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 page-arch">
      <div className="w-full max-w-md profile-card p-8">
        <div className="flex justify-center mb-4">
          <Image src="/textures/logo-green.png" alt="Dual Persian" width={120} height={60} />
        </div>
        <h1 className="font-heading text-2xl font-bold text-center mb-2 text-warm-brown">Set Up Your Profile</h1>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              s === step ? "bg-primary text-white" : s < step ? "bg-accent text-white" : "bg-warm-border/30 text-muted"
            }`}>{s}</div>
          ))}
        </div>
        <div className="ornament-divider mb-6"><span className="ornament-icon">✦</span></div>

        {error && <div className="bg-primary/10 text-primary px-4 py-3 rounded-lg text-sm mb-4">{error}</div>}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-warm-brown">Your Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="warm-input" placeholder="Your display name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-warm-brown">Age</label>
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} min="18" max="99" className="warm-input" placeholder="Your age" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-warm-brown">I am a...</label>
              <div className="flex gap-3">
                {GENDER_OPTIONS.map((g) => (
                  <button key={g} type="button" onClick={() => setGender(g)}
                    className={`flex-1 py-3 rounded-lg border font-medium transition-colors ${gender === g ? "border-primary bg-primary text-white" : "border-warm-border bg-cream-light hover:border-primary text-warm-brown"}`}
                  >{g}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-warm-brown">Looking for...</label>
              <div className="flex gap-3">
                {LOOKING_FOR_OPTIONS.map((l) => (
                  <button key={l} type="button" onClick={() => setLookingFor(l)}
                    className={`flex-1 py-3 rounded-lg border font-medium transition-colors ${lookingFor === l ? "border-primary bg-primary text-white" : "border-warm-border bg-cream-light hover:border-primary text-warm-brown"}`}
                  >{l}</button>
                ))}
              </div>
            </div>
            <div className="terracotta-strip rounded-full" />
            <button onClick={() => setStep(2)} disabled={!name || !age || !gender || !lookingFor} className="btn-terracotta w-full py-3">Next</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-warm-brown">Bio</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="warm-input resize-none" placeholder="Tell people about yourself..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-warm-brown">Education</label>
              <input type="text" value={education} onChange={(e) => setEducation(e.target.value)} className="warm-input" placeholder="e.g. BSc Computer Science, UCLA" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-warm-brown">Profession</label>
              <input type="text" value={profession} onChange={(e) => setProfession(e.target.value)} className="warm-input" placeholder="e.g. Software Engineer" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-warm-brown">Height (cm)</label>
              <input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} min="120" max="220" className="warm-input" placeholder="e.g. 175" />
            </div>
            <div className="terracotta-strip rounded-full" />
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-outline flex-1 py-3">Back</button>
              <button onClick={() => setStep(3)} disabled={!education || !profession || !heightCm} className="btn-terracotta flex-1 py-3">Next</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-warm-brown">City</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="warm-input" placeholder="e.g. London" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-warm-brown">Country</label>
              <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} className="warm-input" placeholder="e.g. United Kingdom" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-warm-brown">Profile Photo</label>
              <div className="flex items-center gap-4">
                {photoPreview && (
                  <img src={photoPreview} alt="Preview" className="w-20 h-20 rounded-full object-cover border-2 border-warm-border" />
                )}
                <label className="flex-1 flex items-center justify-center py-3 rounded-lg border-2 border-dashed border-warm-border hover:border-primary cursor-pointer transition-colors">
                  <span className="text-muted text-sm">{photoFile ? "Change photo" : "Upload a photo"}</span>
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </label>
              </div>
            </div>
            <div className="terracotta-strip rounded-full" />
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="btn-outline flex-1 py-3">Back</button>
              <button onClick={handleSubmit} disabled={loading || !city || !country} className="btn-terracotta flex-1 py-3">
                {loading ? "Saving..." : "Complete Profile"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
