"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/discover");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section — full arch background */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* Left: Text */}
          <div className="flex-1 text-center md:text-left">
            <div className="mb-6">
              <Image
                src="/textures/logo-green.png"
                alt="Dual Persian"
                width={440}
                height={220}
                className="mx-auto md:mx-0"
              />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-warm-brown leading-tight mb-4">
              Find Your{" "}
              <span className="italic text-primary">
                Persian Love Story.
              </span>
            </h1>
            <p className="text-lg text-muted mb-2">
              The Iranian diaspora&apos;s dating app.
            </p>
            <p className="text-muted mb-8">
              London · Los Angeles · Toronto · Sydney
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <Link href="/signup" className="btn-outline">
                Get Started
              </Link>
              <Link href="/login" className="btn-terracotta">
                Log In
              </Link>
            </div>
          </div>

          {/* Right: Pomegranate image */}
          <div className="flex-1 flex justify-center">
            <Image
              src="/textures/pomegranate.png"
              alt="Persian decorative art"
              width={400}
              height={400}
              className="max-w-[300px] md:max-w-[400px] rounded-2xl drop-shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Terracotta strip divider */}
      <div className="terracotta-strip" />

      {/* Tagline Section — cream textured */}
      <section className="py-12 px-4 text-center">
        <div className="ornament-divider max-w-3xl mx-auto mb-6">
          <span className="ornament-icon">✦</span>
        </div>
        <p className="text-lg text-muted mb-2">
          The Iranian diaspora&apos;s dating app.
        </p>
        <p className="text-muted mb-2">
          London · Los Angeles · Toronto · Sydney
        </p>
        <h2 className="font-heading text-2xl md:text-3xl font-semibold text-warm-brown italic mt-4">
          Where modern dating meets timeless tradition
        </h2>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Made for Iranians living abroad",
              desc: "Connect with Persians who share your dual-culture experience.",
            },
            {
              title: "Rooted in shared values",
              desc: "Find someone who understands your heritage and your world.",
            },
            {
              title: "Designed for meaningful relationships",
              desc: "Not just swiping — real connections built on substance.",
            },
          ].map((feature) => (
            <div key={feature.title} className="feature-card p-6 text-center">
              <div className="text-primary text-2xl mb-3">✦</div>
              <h3 className="font-heading text-lg font-semibold text-warm-brown mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Band — green textured */}
      <section className="bg-green-textured py-12 px-4 text-center">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4">
          Join a community of dual-culture singles
        </h2>
        <p className="text-white/80 mb-8 max-w-xl mx-auto">
          Sign up now and start meeting Persian singles who share your
          values and understand your background.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/signup"
            className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-cream-light transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
          >
            Log In
          </Link>
        </div>
      </section>

      {/* Footer is now global via layout.tsx */}
    </div>
  );
}
