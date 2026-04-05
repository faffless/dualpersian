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
      {/* MOBILE Hero — pomegranate layout (hidden on desktop) */}
      <section className="md:hidden px-4 py-8">
        <div className="text-center">
          <Image
            src="/textures/logo-green.png"
            alt="Dual Persian"
            width={180}
            height={90}
            className="mx-auto mb-5"
          />
          <h1 className="font-heading text-3xl font-bold text-warm-brown leading-tight mb-3">
            Find Your{" "}
            <span className="italic text-primary block">
              Persian Love Story.
            </span>
          </h1>
          <p className="text-base text-muted mb-1">
            The Iranian diaspora&apos;s dating app.
          </p>
          <p className="text-sm text-muted mb-6">
            London · Los Angeles · Toronto · Sydney
          </p>
          <div className="flex gap-3 justify-center mb-8">
            <Link href="/signup" className="btn-outline text-sm px-6 py-2.5">
              Get Started
            </Link>
            <Link href="/login" className="btn-terracotta text-sm px-6 py-2.5">
              Log In
            </Link>
          </div>
          <Image
            src="/textures/pomegranate.png"
            alt="Persian decorative art"
            width={200}
            height={200}
            className="mx-auto drop-shadow-lg"
          />
        </div>
      </section>

      {/* DESKTOP Hero — arch + woman (hidden on mobile) */}
      <section className="hidden md:block relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex min-h-[500px] rounded-xl overflow-hidden shadow-lg">
            {/* Left side: arch background with text overlay */}
            <div className="relative flex-1 flex items-center justify-center">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/textures/arch-cream.png')" }}
              />
              <div className="relative z-10 px-8 py-10 max-w-md text-center mx-auto">
                <Image
                  src="/textures/logo-green.png"
                  alt="Dual Persian"
                  width={180}
                  height={90}
                  className="mb-5 mx-auto"
                />
                <h1 className="font-heading text-3xl lg:text-4xl font-bold text-warm-brown leading-tight mb-3">
                  Find Your{" "}
                  <span className="italic text-primary block">
                    Persian Love Story.
                  </span>
                </h1>
                <p className="text-base text-muted mb-1">
                  The Iranian diaspora&apos;s dating app.
                </p>
                <p className="text-sm text-muted mb-6">
                  London · Los Angeles · Toronto · Sydney
                </p>
                <div className="flex gap-3 justify-center">
                  <Link href="/signup" className="btn-outline text-sm px-6 py-2.5">
                    Get Started
                  </Link>
                  <Link href="/login" className="btn-terracotta text-sm px-6 py-2.5">
                    Log In
                  </Link>
                </div>
              </div>
            </div>

            {/* Right side: woman photo */}
            <div className="relative w-[45%]">
              <Image
                src="/textures/woman.png"
                alt="Persian woman"
                fill
                className="object-cover object-top"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Couples Section */}
      <section className="hidden md:block max-w-6xl mx-auto px-8 mt-6">
        <Image
          src="/textures/couples.png"
          alt="Success stories — Bahar & Arash in Los Angeles, Dorsa & Farhad in Toronto, Roya & Navid in London"
          width={1400}
          height={400}
          className="w-full h-auto rounded-xl shadow-lg"
        />
      </section>

      {/* Features Section */}
      <section className="py-8 px-4">
        <h2 className="font-heading text-2xl md:text-3xl font-semibold text-warm-brown text-center italic mb-6">
          Where modern dating meets timeless tradition
        </h2>
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
      <section className="bg-green-textured py-8 px-4 text-center">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-3">
          Join a community of dual-culture singles
        </h2>
        <p className="text-white/80 mb-6 max-w-xl mx-auto text-sm">
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
    </div>
  );
}
