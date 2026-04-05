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
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <Link href="/">
            <Image
              src="/textures/logo-green.png"
              alt="Dual Persian"
              width={140}
              height={70}
              className="brightness-0 invert opacity-80"
            />
          </Link>
          <nav className="flex flex-wrap justify-center gap-4 text-xs">
            <Link href="/" className="text-white/80 hover:text-white transition-colors">Home</Link>
            <Link href="/about" className="text-white/80 hover:text-white transition-colors">About</Link>
            <Link href="/privacy" className="text-white/80 hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="text-white/80 hover:text-white transition-colors">Terms</Link>
            <Link href="/cookies" className="text-white/80 hover:text-white transition-colors">Cookies</Link>
            <Link href="/contact" className="text-white/80 hover:text-white transition-colors">Contact</Link>
          </nav>
        </div>
        <div className="border-t border-white/20 my-3" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/50">
          <p>&copy; 2026 Dual Persian. All rights reserved.</p>
          <p>dualpersian.com</p>
        </div>
      </div>
    </footer>
  );
}
