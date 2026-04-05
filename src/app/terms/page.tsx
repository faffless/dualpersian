export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      <div className="parchment-card p-8 md:p-12">
        <h1 className="font-heading text-3xl font-bold text-warm-brown mb-2">Terms of Service</h1>
        <p className="text-sm text-muted mb-6">Last updated: 28 March 2026</p>
        <div className="ornament-divider mb-8"><span className="ornament-icon">✦</span></div>

        <div className="space-y-6 text-sm text-warm-brown leading-relaxed">
          <section>
            <h2 className="font-heading text-xl font-semibold mb-2">1. Eligibility</h2>
            <p>You must be at least 18 years of age to use Dual Persian. By creating an account, you confirm that you are 18 or older and that all information you provide is accurate and truthful.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-2">2. Your Account</h2>
            <p>You are responsible for maintaining the security of your account credentials. You agree not to share your login details with others. You are responsible for all activity that occurs under your account.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-2">3. Acceptable Use</h2>
            <p>When using Dual Persian, you agree not to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1 text-muted">
              <li>Harass, abuse, or threaten other users</li>
              <li>Post false, misleading, or fraudulent profile information</li>
              <li>Upload offensive, explicit, or inappropriate content</li>
              <li>Use the platform for commercial purposes or solicitation</li>
              <li>Attempt to access other users&apos; accounts</li>
              <li>Use automated tools, bots, or scrapers on the platform</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-2">4. Content Guidelines</h2>
            <p>Profile photos must be of yourself and must not contain explicit, violent, or offensive material. Bios and messages must be respectful. We reserve the right to remove content that violates these guidelines without notice.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-2">5. Matches &amp; Communication</h2>
            <p>Dual Persian facilitates introductions between users. We do not guarantee any outcomes from using the service. You are solely responsible for your interactions with other users. Exercise caution when meeting anyone in person.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-2">6. Termination</h2>
            <p>We may suspend or terminate your account at any time if we believe you have violated these terms. You may delete your account at any time through the app settings.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-2">7. Limitation of Liability</h2>
            <p>Dual Persian is provided &ldquo;as is&rdquo; without warranties of any kind. We are not liable for any damages arising from your use of the service, including but not limited to interactions with other users, data loss, or service interruptions.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-2">8. Changes to Terms</h2>
            <p>We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the updated terms.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-2">9. Governing Law</h2>
            <p>These terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-2">10. Contact</h2>
            <p>For questions about these terms, contact us at <span className="text-primary font-medium">legal@dualpersian.com</span></p>
          </section>
        </div>
      </div>
    </div>
  );
}
