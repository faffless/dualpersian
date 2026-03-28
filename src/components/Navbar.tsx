"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return null;

  const links = [
    { href: "/discover", label: "Discover" },
    { href: "/matches", label: "Matches" },
    { href: "/profile/edit", label: "Profile" },
  ];

  return (
    <nav className="bg-green-textured sticky top-0 z-50 shadow-md">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/discover" className="flex items-center gap-2">
          <Image
            src="/textures/logo-green.png"
            alt="Dual Persian"
            width={100}
            height={35}
            className="brightness-200 invert opacity-90"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors font-heading tracking-wide ${
                pathname === link.href
                  ? "bg-white/20 text-white"
                  : "text-cream/80 hover:text-white hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={signOut}
            className="ml-2 px-3 py-2 rounded-lg text-sm text-cream/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden text-white text-xl px-2"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-white/10 px-4 py-3 space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium font-heading ${
                pathname === link.href
                  ? "bg-white/20 text-white"
                  : "text-cream/80 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => { signOut(); setMenuOpen(false); }}
            className="block w-full text-left px-3 py-2 rounded-lg text-sm text-cream/70 hover:text-white"
          >
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
}
