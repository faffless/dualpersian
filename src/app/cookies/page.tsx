export default function CookiesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      <div className="parchment-card p-8 md:p-12">
        <h1 className="font-heading text-3xl font-bold text-warm-brown mb-2">Cookie Policy</h1>
        <p className="text-sm text-muted mb-6">Last updated: 28 March 2026</p>
        <div className="ornament-divider mb-8"><span className="ornament-icon">✦</span></div>

        <div className="space-y-6 text-sm text-warm-brown leading-relaxed">
          <section>
            <h2 className="font-heading text-xl font-semibold mb-2">1. What Are Cookies</h2>
            <p>Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences and improve your experience.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-2">2. Cookies We Use</h2>
            <p>Dual Persian uses the following types of cookies:</p>
            <ul className="list-disc ml-6 mt-2 space-y-2 text-muted">
              <li><strong className="text-warm-brown">Essential cookies:</strong> Required for authentication and keeping you logged in. These cannot be disabled as the service will not function without them.</li>
              <li><strong className="text-warm-brown">Preference cookies:</strong> Remember your settings and preferences (such as language or filter choices).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-2">3. What We Don&apos;t Use</h2>
            <p>We do <strong>not</strong> use:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1 text-muted">
              <li>Advertising or tracking cookies</li>
              <li>Third-party analytics cookies</li>
              <li>Social media tracking cookies</li>
            </ul>
            <p className="mt-2">We believe in minimal data collection. We only use cookies that are necessary for the service to function.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-2">4. Managing Cookies</h2>
            <p>You can manage or delete cookies through your browser settings. Please note that disabling essential cookies will prevent you from using Dual Persian, as they are required for authentication.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-2">5. Contact</h2>
            <p>For questions about our cookie policy, contact us at <span className="text-primary font-medium">privacy@dualpersian.com</span></p>
          </section>
        </div>
      </div>
    </div>
  );
}
