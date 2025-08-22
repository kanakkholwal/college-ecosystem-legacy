// app/privacy-policy/page.tsx
import AdUnit from "@/components/common/adsense";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How nith.eu.org and app.nith.eu.org collect, use, and protect your data, including cookies, analytics, ads, and user-submitted information.",
  robots: { index: true, follow: true },
};

const Updated = () => {
  // Set an explicit last-updated date here if you prefer a fixed value.
  const d = new Date();
  const lastUpdated = d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return <time dateTime={d.toISOString()}>{lastUpdated}</time>;
};

export default function PrivacyPolicyPage() {
  return (
    <main className="px-4 py-10 md:py-16">
      <article className="prose prose-zinc dark:prose-invert max-w-none">
        <h1>Privacy Policy</h1>
        <p>
          This Privacy Policy explains how <strong>nith.eu.org</strong> and{" "}
          <strong>app.nith.eu.org</strong> (the “Site”, “App”, “we”, “our”, or
          “us”) collect, use, disclose, and safeguard your information when you
          visit or use our services.
        </p>
        <p>
          <strong>Last updated:</strong> <Updated />
        </p>

        <h2>Who We Are</h2>
        <p>
          We are a student-run platform providing resources and tools for the
          NIT Hamirpur community. We are not officially affiliated with NIT
          Hamirpur. Contact us at{" "}
          <a href="mailto:contact@nith.eu.org">contact@nith.eu.org</a>.
        </p>

        <h2>Scope</h2>
        <p>
          This Policy covers all properties we operate, including{" "}
          <code>nith.eu.org</code> and <code>app.nith.eu.org</code>, and any
          related pages, tools, or APIs that link to this Policy.
        </p>

        <h2>Information We Collect</h2>
        <ul>
          <li>
            <strong>Usage & device data:</strong> IP address, approximate
            location (city/region), device type, pages viewed, referring/exit
            pages, and timestamps.
          </li>
          <li>
            <strong>Cookies and similar technologies:</strong> identifiers that
            help us remember preferences, keep you signed in, measure traffic,
            personalize content, and serve ads (where enabled).
          </li>
          <li>
            <strong>
              Account & submissions (if you sign in or submit data):
            </strong>{" "}
            name, email, roll number or identifiers you choose to provide,
            community posts, forms, feedback, uploaded files, and preferences.
          </li>
          <li>
            <strong>Logs & security signals:</strong> events that help detect
            fraud, abuse, or outages.
          </li>
        </ul>

        <h2>How We Use Information</h2>
        <ul>
          <li>Operate, maintain, and improve the Site and App.</li>
          <li>
            Provide features (e.g., results lookup, resources, communities).
          </li>
          <li>Personalize content and remember settings.</li>
          <li>Measure performance and analyze product usage.</li>
          <li>Detect, prevent, and respond to security incidents or abuse.</li>
          <li>Comply with legal obligations.</li>
          <li>
            Monetize via advertising and/or affiliate links (where enabled).
          </li>
        </ul>

        <h2>Cookies & Online Advertising</h2>
        <p>
          We use first-party and third-party cookies, pixels, and local storage
          for functionality, analytics, and advertising.
        </p>
        <h3>Google AdSense (when enabled)</h3>
        <ul>
          <li>
            Third-party vendors, including Google, use cookies to serve ads
            based on your prior visits to this and other websites.
          </li>
          <li>
            Google’s advertising cookies enable Google and its partners to serve
            ads to you based on your visits to our sites and/or other sites on
            the Internet.
          </li>
          <li>
            You can opt out of personalized advertising from Google via{" "}
            <a
              href="https://adssettings.google.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              Ads Settings
            </a>{" "}
            and learn more at{" "}
            <a
              href="https://policies.google.com/technologies/ads"
              rel="noopener noreferrer"
              target="_blank"
            >
              Google’s Ads Policy
            </a>
            . You can also visit{" "}
            <a
              href="https://www.aboutads.info/choices"
              rel="noopener noreferrer"
              target="_blank"
            >
              aboutads.info/choices
            </a>{" "}
            for broader industry opt-out choices (where available).
          </li>
        </ul>
    <AdUnit
        adSlot="multiplex"
        key={"privacy-policy-page-ad"}
      />
        <h3>Analytics</h3>
        <p>
          We may use privacy-respecting analytics and/or mainstream tools to
          understand traffic and usage. These may set cookies or collect
          pseudonymous identifiers and event data. Where feasible, we minimize
          or aggregate metrics.
        </p>

        <h2>Affiliate Links (when used)</h2>
        <p>
          Some outbound links may be affiliate links. If you click an affiliate
          link and make a purchase, we may earn a commission at no extra cost to
          you. Affiliate partners may use cookies or tracking parameters to
          attribute conversions.
        </p>

        <h2>Legal Bases for Processing (EEA/UK)</h2>
        <ul>
          <li>
            <strong>Contract:</strong> to provide requested features/services.
          </li>
          <li>
            <strong>Legitimate interests:</strong> to secure, operate, and
            improve our services; combat abuse; measure performance.
          </li>
          <li>
            <strong>Consent:</strong> for optional cookies, personalized ads, or
            email communications where required.
          </li>
          <li>
            <strong>Legal obligation:</strong> to comply with applicable laws.
          </li>
        </ul>

        <h2>Your Rights & Choices</h2>
        <ul>
          <li>
            <strong>Cookie controls:</strong> browser settings, opt-out links
            (e.g., Google Ads Settings), and any consent banner we provide.
          </li>
          <li>
            <strong>Access, correction, deletion:</strong> request a copy,
            update, or deletion of your personal data, subject to legal
            exceptions.
          </li>
          <li>
            <strong>Consent withdrawal:</strong> where processing is based on
            consent, you can withdraw it at any time.
          </li>
        </ul>

        <h2>Data Sharing</h2>
        <ul>
          <li>
            <strong>Service providers:</strong> hosting, analytics, security,
            and support vendors under appropriate confidentiality terms.
          </li>
          <li>
            <strong>Advertising/affiliate partners:</strong> to deliver ads,
            measure performance, and attribute conversions.
          </li>
          <li>
            <strong>Legal and safety:</strong> to comply with law, enforce
            policies, or protect rights, property, and safety.
          </li>
          <li>
            <strong>Business changes:</strong> in a reorganization or transfer,
            data may be part of the transacting assets (subject to this Policy).
          </li>
        </ul>

        <h2>Data Retention</h2>
        <p>
          We retain personal data only as long as necessary for the purposes in
          this Policy, unless a longer period is required by law or to resolve
          disputes and enforce agreements.
        </p>

        <h2>Security</h2>
        <p>
          We use reasonable technical and organizational measures to protect
          data. No method of transmission or storage is 100% secure; risk cannot
          be eliminated.
        </p>

        <h2>Children’s Privacy</h2>
        <p>
          Our services are intended for users above the age required by local
          law to provide consent. If you believe a child provided us personal
          data without consent, contact us and we will take appropriate action.
        </p>

        <h2>International Transfers</h2>
        <p>
          We may process and store information in countries other than yours.
          When we transfer personal data, we use lawful transfer mechanisms as
          required.
        </p>

        <h2>Third-Party Links</h2>
        <p>
          Our Site and App may link to third-party sites. We are not responsible
          for their content or privacy practices. Review their policies.
        </p>

        <h2>Do Not Track</h2>
        <p>
          Some browsers offer a “Do Not Track” (DNT) signal. We do not currently
          respond to DNT signals due to a lack of industry standard.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Policy from time to time. We will post any changes
          on this page and update the “Last updated” date above. Material
          changes may be communicated through additional notices.
        </p>

        <h2>Contact</h2>
        <p>
          Questions or requests about this Policy or your data:{" "}
          <a href="mailto:contact@nith.eu.org">contact@nith.eu.org</a>
        </p>

        <hr />
        <p>
          <em>
            Disclaimer: This platform is unofficial and not affiliated with the
            National Institute of Technology, Hamirpur. Names or marks remain
            the property of their respective owners.
          </em>
        </p>
            <AdUnit
        adSlot="multiplex"
        key={"privacy-policy-page-ad-footer"}
      />
      </article>
    </main>
  );
}
