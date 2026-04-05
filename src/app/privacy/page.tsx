export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      <div className="parchment-card p-8 md:p-12">
        <h1 className="font-heading text-3xl font-bold text-warm-brown mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted mb-6">Last updated: 28 March 2026</p>
        <div className="ornament-divider mb-8"><span className="ornament-icon">✦</span></div>

        <div className="space-y-6 text-sm text-warm-brown leading-relaxed">
          <section>
            <h2 className="font-heading text-xl font-semibold mb-2">1. Information We Collect</h2>
            <p>When you create an account on Dual Persian, we collect the following information:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1 text-muted">
              <li>Email address and password (for authentication)</li>
              <li>Profile information: name, age, gender, bio, education, profession, height</li>
              <li>Location: city and country (optionally detected via browser geolocation)</li>
              <li>Photos you upload to your profile</li>
              <li>Messages you send to other users</li>
              <li>Usage data: likes, matches, and interaction patterns</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-2">2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1 text-muted">
              <li>Create and manage your account</li>
              <li>Display your profile to other users for matching purposes</li>
              <li>Enable communication between matched users</li>
              <li>Improve our service and user experience</li>
              <li>Send important service-related notifications</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-2">3. Data Storage &amp; Security</h2>
            <p>Your data is stored securely using Supabase, a trusted cloud database provider. All data is encrypted in transit using TLS/SSL. Passwords are hashed and never stored in plain text. Photos are stored in secure cloud storage with access controls.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-2">4. Third-Party Sharing</h2>
            <p>We do not sell your personal data to third parties. We may share data with:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1 text-muted">
              <li>Identity verification services (for photo verification features)</li>
              <li>Cloud infrastructure providers (for hosting and storage)</li>
              <li>Law enforcement, if required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-2">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1 text-muted">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and all associated data</li>
              <li>Export your data in a portable format</li>
              <li>Withdraw consent for data processing at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-2">6. Data Retention</h2>
            <p>We retain your data for as long as your account is active. If you delete your account, we will remove your personal data within 30 days, except where retention is required by law.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-2">7. Contact Us</h2>
            <p>For privacy-related queries, please contact us at <span className="text-primary font-medium">privacy@dualpersian.com</span></p>
          </section>
        </div>
      </div>
    </div>
  );
}
