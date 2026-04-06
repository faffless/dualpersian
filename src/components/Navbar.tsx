"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

type DropdownItem = { href: string; label: string };
type NavItem = { label: string; href?: string; children?: DropdownItem[] };

function Dropdown({ item, pathname, close }: { item: NavItem; pathname: string; close: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!item.children) {
    return (
      <Link
        href={item.href || "/"}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors font-heading tracking-wide ${
          pathname === item.href ? "bg-white/20 text-white" : "text-cream/80 hover:text-white hover:bg-white/10"
        }`}
      >
        {item.label}
      </Link>
    );
  }

  const isActive = item.children.some((c) => pathname.startsWith(c.href));

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors font-heading tracking-wide flex items-center gap-1 ${
          isActive ? "bg-white/20 text-white" : "text-cream/80 hover:text-white hover:bg-white/10"
        }`}
      >
        {item.label}
        <svg className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-warm-border py-1 min-w-[180px] z-50">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={() => { setOpen(false); close(); }}
              className={`block px-4 py-2 text-sm transition-colors ${
                pathname === child.href ? "bg-cream text-primary font-medium" : "text-warm-brown hover:bg-cream"
              }`}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  useEffect(() => {
    document.body.classList.add("has-navbar");
    return () => document.body.classList.remove("has-navbar");
  }, []);

  const navItems: NavItem[] = [
    { label: "Home", href: "/" },
    {
      label: "Community", children: [
        { href: "/forums", label: "Forums" },
        { href: "/forums/culture-identity", label: "Culture & Identity" },
        { href: "/forums/general", label: "General Discussion" },
      ]
    },
    {
      label: "Meet Singles", children: [
        { href: "/discover", label: "Browse Profiles" },
        { href: "/matches", label: "My Matches" },
      ]
    },
    {
      label: "Parenting", children: [
        { href: "/parenting", label: "Parenting Hub" },
        { href: "/forums/parenting", label: "Parenting Forum" },
      ]
    },
    {
      label: "Events", children: [
        { href: "/events", label: "Upcoming Events" },
      ]
    },
    { label: "About Us", href: "/about" },
  ];

  return (
    <nav className="bg-green-textured sticky top-0 z-50 shadow-md">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/textures/header icon.png" alt="Dual Persian" width={120} height={40} className="brightness-0 invert" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-0.5">
          {navItems.map((item) => (
            <Dropdown key={item.label} item={item} pathname={pathname} close={() => {}} />
          ))}
          {user ? (
            <div className="flex items-center gap-1 ml-2">
              <Link href="/profile/edit" className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors font-heading tracking-wide ${pathname === "/profile/edit" ? "bg-white/20 text-white" : "text-cream/80 hover:text-white hover:bg-white/10"}`}>
                Profile
              </Link>
              <button onClick={signOut} className="px-3 py-2 rounded-lg text-sm text-cream/70 hover:text-white hover:bg-white/10 transition-colors">
                Sign Out
              </button>
            </div>
          ) : (
            <Link href="/signup" className="ml-2 px-4 py-2 rounded-lg text-sm bg-primary text-white hover:bg-primary-light transition-colors font-heading tracking-wide font-semibold">
              Join Now
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-white text-xl px-2">
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-white/10 px-4 py-3 space-y-1 max-h-[70vh] overflow-y-auto">
          {navItems.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium font-heading text-cream/80 hover:text-white"
                  >
                    {item.label}
                    <svg className={`w-3 h-3 transition-transform ${mobileExpanded === item.label ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {mobileExpanded === item.label && (
                    <div className="ml-4 space-y-1">
                      {item.children.map((child) => (
                        <Link key={child.href} href={child.href} onClick={() => setMenuOpen(false)}
                          className={`block px-3 py-1.5 rounded-lg text-sm ${pathname === child.href ? "text-white bg-white/10" : "text-cream/60 hover:text-white"}`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link href={item.href || "/"} onClick={() => setMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium font-heading ${pathname === item.href ? "bg-white/20 text-white" : "text-cream/80 hover:text-white"}`}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          {user ? (
            <>
              <Link href="/profile/edit" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm text-cream/80 hover:text-white font-heading">Profile</Link>
              <button onClick={() => { signOut(); setMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-lg text-sm text-cream/70 hover:text-white">Sign Out</button>
            </>
          ) : (
            <Link href="/signup" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm bg-primary text-white font-heading text-center mt-2">Join Now</Link>
          )}
        </div>
      )}
    </nav>
  );
}
