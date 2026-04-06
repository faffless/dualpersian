"use client";

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* MOBILE Hero (hidden on desktop) */}
      <section className="md:hidden px-4 pt-3 pb-2">
        <div className="text-center">
          <Image src="/textures/logo-green.png" alt="Dual Persian" width={180} height={90} className="mx-auto mb-5" />
          <h1 className="font-heading text-3xl font-bold text-warm-brown leading-tight mb-3">
            A Vibrant <span className="italic text-primary block">Persian Community</span>
          </h1>
          <p className="text-base text-muted mb-1">Connect, share, and thrive as part of the Iranian diaspora worldwide.</p>
          <p className="text-sm text-muted mb-6">London · Los Angeles · Toronto · Sydney</p>
          <div className="flex gap-3 justify-center mb-4">
            <Link href="/signup" className="btn-terracotta text-sm px-6 py-2.5">Join the Community</Link>
          </div>
          <Image src="/textures/pomegranate.png" alt="Persian decorative art" width={160} height={160} className="mx-auto drop-shadow-lg mb-2" />
        </div>
      </section>

      {/* DESKTOP Hero — arch + woman (hidden on mobile) */}
      <section className="hidden md:block pt-6">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-5 min-h-[480px]">
            <div className="relative flex-1 rounded-lg overflow-hidden shadow-lg border-2 border-warm-border"
              style={{ boxShadow: "0 0 0 4px #F5EDE3, 0 0 0 6px #D4C4B0, 0 0 0 10px #F5EDE3, 0 0 0 12px #D4C4B0" }}>
              <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/textures/arch-cream.png')" }} />
              <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 py-8 text-center">
                <Image src="/textures/logo-green.png" alt="Dual Persian" width={150} height={75} className="mb-4 mx-auto" />
                <h1 className="font-heading text-2xl lg:text-3xl font-bold text-warm-brown leading-tight mb-2">
                  A Vibrant <span className="italic text-primary block">Persian Community</span>
                </h1>
                <p className="text-sm text-muted mb-0.5">Connect, share, and thrive as part of the Iranian diaspora worldwide.</p>
                <p className="text-xs text-muted mb-4">London · Los Angeles · Toronto · Sydney</p>
                <Link href="/signup" className="btn-terracotta text-sm px-6 py-2.5">Join the Community</Link>
              </div>
            </div>
            <div className="relative flex-1 rounded-lg overflow-hidden shadow-lg border-2 border-warm-border"
              style={{ boxShadow: "0 0 0 4px #F5EDE3, 0 0 0 6px #D4C4B0, 0 0 0 10px #F5EDE3, 0 0 0 12px #D4C4B0" }}>
              <Image src="/textures/woman.png" alt="Persian woman" fill className="object-cover object-top" priority />
            </div>
          </div>
        </div>
      </section>

      {/* Community Pillars */}
      <section className="py-8 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "❤️", title: "Meet Singles", desc: "Find love within your culture — meet and date Persians who share your values and background.", href: "/discover" },
            { icon: "💬", title: "Community Discussions", desc: "Connect with fellow Persians in our forums to discuss culture, lifestyle, and current events.", href: "/forums" },
            { icon: "👨‍👩‍👧‍👦", title: "Parenting Support", desc: "Get advice on raising Persian children biculturally and connect with other parents.", href: "/parenting" },
          ].map((item) => (
            <Link key={item.title} href={item.href} className="feature-card p-6 text-center hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-heading text-lg font-semibold text-warm-brown mb-2">{item.title}</h3>
              <p className="text-sm text-muted">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Welcome + 4-column grid */}
      <section className="py-6 px-4">
        <div className="max-w-5xl mx-auto text-center mb-6">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-warm-brown mb-2">Welcome to Dual Persian</h2>
          <p className="text-muted">Bringing the Iranian diaspora together</p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "❤️", title: "Meet Singles", desc: "Find love within your culture.", href: "/discover" },
            { icon: "💬", title: "Community Discussions", desc: "Connect with fellow Persians.", href: "/forums" },
            { icon: "👨‍👩‍👧‍👦", title: "Parenting Support", desc: "Raise Persian children biculturally.", href: "/parenting" },
            { icon: "📅", title: "Local Events", desc: "Stay informed about Persian events and meetups.", href: "/events" },
          ].map((item) => (
            <Link key={item.title} href={item.href} className="parchment-card p-4 text-center hover:shadow-md transition-shadow">
              <div className="text-2xl mb-2">{item.icon}</div>
              <h3 className="font-heading text-sm font-semibold text-warm-brown mb-1">{item.title}</h3>
              <p className="text-xs text-muted">{item.desc}</p>
            </Link>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link href="/forums" className="btn-outline text-sm px-6 py-2">Browse Forums →</Link>
        </div>
      </section>

      {/* Couples Section */}
      <section className="hidden md:block pb-6">
        <div className="max-w-5xl mx-auto px-4">
          <div className="rounded-lg overflow-hidden shadow-lg border-2 border-warm-border"
            style={{ boxShadow: "0 0 0 4px #F5EDE3, 0 0 0 6px #D4C4B0, 0 0 0 10px #F5EDE3, 0 0 0 12px #D4C4B0" }}>
            <Image src="/textures/couples.png" alt="Success stories" width={1400} height={400} className="w-full h-auto" />
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="bg-green-textured py-8 px-4 text-center">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-3">
          Join a thriving community of Persian singles, couples, and families.
        </h2>
        <p className="text-white/80 mb-6 max-w-xl mx-auto text-sm">
          Sign up now and connect with Iranians worldwide who share your values, culture, and experiences.
        </p>
        <Link href="/signup" className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-cream-light transition-colors">
          Join Now for Free
        </Link>
      </section>
    </div>
  );
}
