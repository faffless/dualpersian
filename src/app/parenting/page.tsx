"use client";

import Link from "next/link";

export default function ParentingPage() {
  return (
    <div className="page-cream">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="font-heading text-3xl font-bold text-warm-brown flex items-center gap-2">
          Parenting Hub <span className="text-primary text-lg">&#x2726;</span>
        </h1>
        <p className="text-muted text-sm mt-1 mb-6">
          Resources and community for raising bicultural Persian children
        </p>

        <div className="ornament-divider mb-8">
          <span className="ornament-icon">&#x2726;</span>
        </div>

        {/* Intro section */}
        <div className="parchment-card p-6 md:p-8 mb-6">
          <h2 className="font-heading text-xl font-semibold text-warm-brown mb-3">
            Raising Bicultural Children
          </h2>
          <div className="space-y-4 text-sm text-warm-brown leading-relaxed">
            <p>
              Raising children who embrace both their Persian heritage and their life in the
              diaspora is one of the most rewarding journeys a parent can take. It comes with
              unique challenges &mdash; navigating two languages, blending traditions, and
              helping children build a strong sense of identity that honours both worlds.
            </p>
            <p>
              This hub is a space for Persian parents to connect, share experiences, and find
              resources that support the beautiful complexity of bicultural family life. Whether
              you are teaching your child Farsi, celebrating Nowruz abroad, or simply looking
              for other parents who understand, you are in the right place.
            </p>
          </div>
        </div>

        {/* Community link */}
        <div className="parchment-card p-6 mb-6">
          <h2 className="font-heading text-xl font-semibold text-warm-brown mb-3">
            Join the Conversation
          </h2>
          <p className="text-sm text-muted mb-4">
            Connect with other Persian parents in our dedicated parenting forum. Share tips,
            ask questions, and support each other on this journey.
          </p>
          <Link href="/forums/parenting" className="btn-terracotta text-sm px-6 py-2 inline-block">
            Visit Parenting Forum
          </Link>
        </div>

        {/* Resources */}
        <div className="parchment-card p-6 md:p-8">
          <h2 className="font-heading text-xl font-semibold text-warm-brown mb-4">
            Resources
          </h2>
          <div className="ornament-divider mb-6">
            <span className="ornament-icon">&#x2726;</span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="font-heading font-semibold text-warm-brown mb-2">
                Language &amp; Literacy
              </h3>
              <ul className="list-disc ml-5 space-y-2 text-sm text-muted">
                <li>Teaching Farsi at home &mdash; starting early with songs and stories</li>
                <li>Bilingual reading habits and book recommendations</li>
                <li>Online Farsi classes and tutoring for children</li>
                <li>Persian alphabet apps and educational tools</li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-warm-brown mb-2">
                Culture &amp; Traditions
              </h3>
              <ul className="list-disc ml-5 space-y-2 text-sm text-muted">
                <li>Celebrating Nowruz, Shab-e Yalda, and other holidays abroad</li>
                <li>Persian cooking with children &mdash; recipes and traditions</li>
                <li>Storytelling from Shahnameh and Persian folklore</li>
                <li>Connecting children with their extended family across borders</li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-warm-brown mb-2">
                Identity &amp; Belonging
              </h3>
              <ul className="list-disc ml-5 space-y-2 text-sm text-muted">
                <li>Helping children navigate dual identity</li>
                <li>Answering questions about heritage and culture</li>
                <li>Building confidence in a multicultural world</li>
                <li>Finding Persian community groups and playgroups</li>
              </ul>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-warm-brown mb-2">
                Practical Guides
              </h3>
              <ul className="list-disc ml-5 space-y-2 text-sm text-muted">
                <li>Choosing schools that support multilingual children</li>
                <li>Balancing cultural expectations with local norms</li>
                <li>Travel tips for visiting Iran with young children</li>
                <li>Co-parenting across cultures</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
