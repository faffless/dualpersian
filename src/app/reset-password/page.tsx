"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Supabase sends the user here with a session after clicking the reset link
  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        // User arrived via password reset link — ready to set new password
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/discover"), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md profile-card p-8">
        <div className="flex justify-center mb-4">
          <Image src="/textures/logo-green.png" alt="Dual Persian" width={140} height={70} />
        </div>
        <h1 className="font-heading text-3xl font-bold text-center mb-2 text-warm-brown">
          Set New Password
        </h1>
        <div className="ornament-divider mb-6">
          <span className="ornament-icon">✦</span>
        </div>

        {success ? (
          <div className="text-center">
            <div className="bg-accent/10 text-accent px-4 py-3 rounded-lg text-sm mb-4">
              Password updated successfully! Redirecting...
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-primary/10 text-primary px-4 py-3 rounded-lg text-sm">{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1 text-warm-brown">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="warm-input"
                placeholder="At least 6 characters"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-warm-brown">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="warm-input"
                placeholder="Type it again"
              />
            </div>
            <div className="terracotta-strip rounded-full" />
            <button type="submit" disabled={loading} className="btn-terracotta w-full py-3">
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
