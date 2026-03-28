import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="parchment-card p-8 md:p-12">
        <div className="flex justify-center mb-4">
          <Image src="/textures/logo-green.png" alt="Dual Persian" width={160} height={80} />
        </div>
        <h1 className="font-heading text-3xl font-bold text-warm-brown mb-2 text-center">About Dual Persian</h1>
        <div className="ornament-divider mb-8"><span className="ornament-icon">✦</span></div>

        <div className="space-y-6 text-sm text-warm-brown leading-relaxed">
          <section>
            <h2 className="font-heading text-xl font-semibold mb-2">Our Mission</h2>
            <p>Dual Persian exists to connect Iranians living abroad with meaningful relationships. We understand that living between two cultures is a unique experience — and finding someone who shares that experience can be transformative.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-2">Why &ldquo;Dual&rdquo;?</h2>
            <p>The name reflects the dual identity that many in the Iranian diaspora carry — rooted in Persian heritage while building lives in cities like London, Los Angeles, Toronto, Sydney, and beyond. We celebrate both sides of that identity.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-2">How It Works</h2>
            <ul className="list-disc ml-6 mt-2 space-y-2 text-muted">
              <li><strong className="text-warm-brown">Create your profile</strong> — Share who you are, your background, education, profession, and what you&apos;re looking for.</li>
              <li><strong className="text-warm-brown">Discover people</strong> — Browse profiles of Persians in your city or around the world. Filter by age, location, and preferences.</li>
              <li><strong className="text-warm-brown">Like &amp; match</strong> — When two people like each other, it&apos;s a match. Simple, intentional, no games.</li>
              <li><strong className="text-warm-brown">Chat</strong> — Start a conversation with your matches. Real-time messaging built right in.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-2">Our Values</h2>
            <ul className="list-disc ml-6 mt-2 space-y-1 text-muted">
              <li>Respect for cultural heritage</li>
              <li>Privacy and data security</li>
              <li>Meaningful connections over superficial swiping</li>
              <li>An inclusive, welcoming community</li>
            </ul>
          </section>

          <div className="text-center pt-4">
            <Image src="/textures/pomegranate.png" alt="Persian art" width={200} height={200} className="mx-auto rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
