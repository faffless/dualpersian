"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/chat/")) return null;

  return (
    <footer className="bg-footer-textured">
      <div className="terracotta-strip opacity-50" />
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
          {/* Column 1: Community */}
          <div>
            <h4 className="text-white font-heading font-semibold text-sm mb-3">Community</h4>
            <nav className="space-y-1.5">
              <Link href="/forums" className="block text-xs text-white/70 hover:text-white transition-colors">Forums</Link>
              <Link href="/forums/culture-identity" className="block text-xs text-white/70 hover:text-white transition-colors">Culture & Identity</Link>
              <Link href="/parenting" className="block text-xs text-white/70 hover:text-white transition-colors">Parenting Support</Link>
              <Link href="/forums/general" className="block text-xs text-white/70 hover:text-white transition-colors">General Discussion</Link>
            </nav>
          </div>

          {/* Column 2: Explore */}
          <div>
            <h4 className="text-white font-heading font-semibold text-sm mb-3">Explore</h4>
            <nav className="space-y-1.5">
              <Link href="/discover" className="block text-xs text-white/70 hover:text-white transition-colors">Meet Singles</Link>
              <Link href="/events" className="block text-xs text-white/70 hover:text-white transition-colors">Events</Link>
              <Link href="/forums/food-recipes" className="block text-xs text-white/70 hover:text-white transition-colors">Food & Recipes</Link>
              <Link href="/forums/career-education" className="block text-xs text-white/70 hover:text-white transition-colors">Career & Education</Link>
            </nav>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="text-white font-heading font-semibold text-sm mb-3">Company</h4>
            <nav className="space-y-1.5">
              <Link href="/about" className="block text-xs text-white/70 hover:text-white transition-colors">About</Link>
              <Link href="/terms" className="block text-xs text-white/70 hover:text-white transition-colors">Terms</Link>
              <Link href="/privacy" className="block text-xs text-white/70 hover:text-white transition-colors">Privacy</Link>
              <Link href="/cookies" className="block text-xs text-white/70 hover:text-white transition-colors">Cookies</Link>
              <Link href="/contact" className="block text-xs text-white/70 hover:text-white transition-colors">Contact</Link>
            </nav>
          </div>

          {/* Column 4: Logo + social */}
          <div className="flex flex-col items-center md:items-end">
            <Link href="/">
              <Image src="/textures/logo-green.png" alt="Dual Persian" width={100} height={50} className="brightness-0 invert opacity-80 mb-3" />
            </Link>
            <p className="text-xs text-white/50 text-center md:text-right">dualpersian.com</p>
          </div>
        </div>

        <div className="border-t border-white/20 pt-3">
          <p className="text-xs text-white/50 text-center">&copy; 2026 Dual Persian. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
