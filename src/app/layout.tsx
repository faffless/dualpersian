import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dual Persian — Meet the Iranian Diaspora",
  description:
    "A dating app connecting Iranians worldwide. Find your match in the global Persian community.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Dual Persian — Find Your Persian Love Story",
    description:
      "The dating app for the Iranian diaspora. Connect with Persians in London, LA, Toronto, Sydney and beyond.",
    url: "https://dualpersian.com",
    siteName: "Dual Persian",
    images: [
      {
        url: "/og-image.png",
        width: 512,
        height: 512,
        alt: "Dual Persian — Dating for the Iranian Diaspora",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Dual Persian — Find Your Persian Love Story",
    description:
      "The dating app for the Iranian diaspora. Connect with Persians worldwide.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}
