"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const { error } = await signIn(email, password);
    if (error) { setError(error.message); setLoading(false); }
    else { router.push("/discover"); }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4" style={{
      backgroundImage: "url('/textures/arch-cream.png')",
      backgroundSize: "cover",
      backgroundPosition: "top center",
    }}>
      <div className="w-full max-w-md profile-card p-8">
        <div className="flex justify-center mb-4">
          <Image src="/textures/logo-green.png" alt="Dual Persian" width={140} height={70} />
        </div>
        <h1 className="font-heading text-3xl font-bold text-center mb-2 text-warm-brown">Welcome Back</h1>
        <div className="ornament-divider mb-6">
          <span className="ornament-icon">✦</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-primary/10 text-primary px-4 py-3 rounded-lg text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium mb-1 text-warm-brown">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="warm-input" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-warm-brown">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="warm-input" placeholder="Your password" />
          </div>
          <div className="terracotta-strip rounded-full" />
          <button type="submit" disabled={loading} className="btn-terracotta w-full py-3">
            {loading ? "Signing in..." : "Log In"}
          </button>
        </form>
        <p className="text-center text-muted mt-4">
          <Link href="/forgot-password" className="text-primary text-sm font-medium hover:underline">
            Forgot your password?
          </Link>
        </p>
        <p className="text-center text-muted mt-3">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary font-medium hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
