"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
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
          Reset Password
        </h1>
        <div className="ornament-divider mb-6">
          <span className="ornament-icon">✦</span>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="bg-accent/10 text-accent px-4 py-3 rounded-lg text-sm mb-4">
              Check your email! We&apos;ve sent a password reset link to <strong>{email}</strong>
            </div>
            <p className="text-sm text-muted mb-4">
              Didn&apos;t receive it? Check your spam folder or try again.
            </p>
            <button
              onClick={() => setSent(false)}
              className="text-primary font-medium text-sm hover:underline"
            >
              Try a different email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-muted text-center mb-2">
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>
            {error && (
              <div className="bg-primary/10 text-primary px-4 py-3 rounded-lg text-sm">{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1 text-warm-brown">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="warm-input"
                placeholder="you@example.com"
              />
            </div>
            <div className="terracotta-strip rounded-full" />
            <button type="submit" disabled={loading} className="btn-terracotta w-full py-3">
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <p className="text-center text-muted mt-6">
          <Link href="/login" className="text-primary font-medium hover:underline">
            Back to Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
