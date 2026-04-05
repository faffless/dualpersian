export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      <div className="parchment-card p-8 md:p-12">
        <h1 className="font-heading text-3xl font-bold text-warm-brown mb-2 text-center">Contact Us</h1>
        <div className="ornament-divider mb-8"><span className="ornament-icon">✦</span></div>

        <div className="space-y-6 text-sm text-warm-brown leading-relaxed">
          <section>
            <h2 className="font-heading text-xl font-semibold mb-2">Get in Touch</h2>
            <p>We&apos;d love to hear from you. Whether you have a question, feedback, or need support — reach out and we&apos;ll get back to you as soon as possible.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-2">Email</h2>
            <div className="space-y-2 text-muted">
              <p><strong className="text-warm-brown">General enquiries:</strong> hello@dualpersian.com</p>
              <p><strong className="text-warm-brown">Support:</strong> support@dualpersian.com</p>
              <p><strong className="text-warm-brown">Privacy queries:</strong> privacy@dualpersian.com</p>
              <p><strong className="text-warm-brown">Legal:</strong> legal@dualpersian.com</p>
            </div>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-2">Response Time</h2>
            <p className="text-muted">We aim to respond to all enquiries within 48 hours.</p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold mb-2">Report a Problem</h2>
            <p className="text-muted">If you need to report a user, inappropriate content, or a safety concern, please email <span className="text-primary font-medium">safety@dualpersian.com</span> and we will investigate promptly.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
