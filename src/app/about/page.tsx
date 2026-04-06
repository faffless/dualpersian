import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      <div className="parchment-card p-8 md:p-12">
        <div className="flex justify-center mb-4">
          <Image src="/textures/logo-green.png" alt="Dual Persian" width={160} height={80} />
        </div>
        <h1 className="font-heading text-3xl font-bold text-warm-brown mb-2 text-center">About Dual Persian</h1>
        <div className="ornament-divider mb-8"><span className="ornament-icon">✦</span></div>

        <div className="space-y-6 text-sm text-warm-brown leading-relaxed">
          <section>
            <h2 className="font-heading text-xl font-semibold mb-2">Our Mission</h2>
            <p>Dual Persian is the community platform for the Iranian diaspora. We bring together Iranians living abroad — connecting singles, families, professionals, and culture enthusiasts across London, Los Angeles, Toronto, Sydney, and beyond.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-2">Why &ldquo;Dual&rdquo;?</h2>
            <p>The name reflects the dual identity that many in the Iranian diaspora carry — rooted in Persian heritage while building lives in new countries. We celebrate both sides of that identity and provide a space where both are understood.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-2">What We Offer</h2>
            <ul className="list-disc ml-6 mt-2 space-y-2 text-muted">
              <li><strong className="text-warm-brown">Meet Singles</strong> — Find love within your culture. Browse profiles, match, and chat with Persians who share your values.</li>
              <li><strong className="text-warm-brown">Community Forums</strong> — Discuss culture, identity, relationships, food, careers, and more with fellow Persians worldwide.</li>
              <li><strong className="text-warm-brown">Parenting Support</strong> — Resources and community for raising bilingual, bicultural children.</li>
              <li><strong className="text-warm-brown">Events</strong> — Discover local Persian events, meetups, and cultural gatherings in your city.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-2">Our Values</h2>
            <ul className="list-disc ml-6 mt-2 space-y-1 text-muted">
              <li>Respect for cultural heritage</li>
              <li>Privacy and data security</li>
              <li>Meaningful connections over superficial interactions</li>
              <li>An inclusive, welcoming community for all Iranians</li>
              <li>Supporting families and the next generation</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-2">Contact</h2>
            <p>Questions or suggestions? Reach us at <a href="mailto:hello@dualpersian.com" className="text-primary underline">hello@dualpersian.com</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
