"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on chat pages (full-height layout)
  if (pathname?.startsWith("/chat/")) return null;

  return (
    <footer className="bg-footer-textured">
      <div className="terracotta-strip opacity-50" />
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Top row: Logo + nav links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <Link href="/">
            <Image
              src="/textures/logo-green.png"
              alt="Dual Persian"
              width={240}
              height={120}
              className="brightness-200 invert opacity-90"
            />
          </Link>
          <nav className="flex flex-wrap justify-center gap-6 text-sm">
            <Link href="/about" className="text-white/80 hover:text-white transition-colors">
              About
            </Link>
            <Link href="/privacy" className="text-white/80 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-white/80 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-white/80 hover:text-white transition-colors">
              Cookie Policy
            </Link>
            <Link href="/contact" className="text-white/80 hover:text-white transition-colors">
              Contact
            </Link>
          </nav>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 mb-6" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>&copy; 2026 Dual Persian. All rights reserved.</p>
          <p>dualpersian.com</p>
        </div>
      </div>
    </footer>
  );
}
