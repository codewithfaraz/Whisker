export default function PrivacyPolicyPage() {
  const lastUpdated = "February 7, 2024";

  return (
    <div className="container py-16 sm:py-24">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-(--color-text) mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-(--color-text-secondary)">
            Last Updated: {lastUpdated}
          </p>
        </div>

        <div className="prose prose-stone max-w-none space-y-10 text-(--color-text-secondary)">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-(--color-text)">
              1. Introduction
            </h2>
            <p>
              Welcome to Whisker&apos;s Haven. We respect your privacy and are
              committed to protecting your personal data. This privacy policy
              will inform you as to how we look after your personal data when
              you visit our website (regardless of where you visit it from) and
              tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-(--color-text)">
              2. Data We Collect
            </h2>
            <p>
              We may collect, use, store and transfer different kinds of
              personal data about you which we have grouped together as follows:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Identity Data:</strong> includes first name, last name,
                and username.
              </li>
              <li>
                <strong>Contact Data:</strong> includes billing address,
                delivery address, email address and telephone numbers.
              </li>
              <li>
                <strong>Transaction Data:</strong> includes details about
                payments to and from you and other details of products and
                services you have purchased from us.
              </li>
              <li>
                <strong>Technical Data:</strong> includes internet protocol (IP)
                address, your login data, browser type and version, and
                location.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-(--color-text)">
              3. How We Use Your Data
            </h2>
            <p>
              We will only use your personal data when the law allows us to.
              Most commonly, we will use your personal data in the following
              circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>To register you as a new customer.</li>
              <li>To process and deliver your order.</li>
              <li>To manage our relationship with you.</li>
              <li>
                To enable you to partake in a prize draw, competition or
                complete a survey.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-(--color-text)">
              4. Data Security
            </h2>
            <p>
              We have put in place appropriate security measures to prevent your
              personal data from being accidentally lost, used or accessed in an
              unauthorized way, altered or disclosed. In addition, we limit
              access to your personal data to those employees, agents,
              contractors and other third parties who have a business need to
              know.
            </p>
          </section>

          <section className="space-y-4 border-t border-(--color-border) pt-10 mt-16">
            <h2 className="text-2xl font-bold text-(--color-text)">
              Contact Us
            </h2>
            <p>
              If you have any questions about this privacy policy or our privacy
              practices, please contact us at:
            </p>
            <p className="font-semibold text-(--color-text)">
              privacy@whiskershaven.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
