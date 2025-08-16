// app/terms/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service & Disclaimer",
  description:
    "Read the Terms of Service and Disclaimer for nith.eu.org and app.nith.eu.org. Learn about usage, disclaimers, limitations of liability, and user responsibilities.",
  robots: { index: true, follow: true },
};

const Updated = () => {
  const d = new Date();
  const lastUpdated = d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return <time dateTime={d.toISOString()}>{lastUpdated}</time>;
};

export default function TermsPage() {
  return (
    <main className="px-4 py-10 md:py-16">
      <article className="prose prose-zinc dark:prose-invert max-w-none">
        <h1>Terms of Service & Disclaimer</h1>
        <p>
          Welcome to <strong>nith.eu.org</strong> and{" "}
          <strong>app.nith.eu.org</strong> (the “Site”, “App”, “we”, “our” or
          “us”). By accessing or using our services, you agree to the following
          Terms of Service (“Terms”). Please read them carefully.
        </p>
        <p>
          <strong>Last updated:</strong> <Updated />
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using the Site or App, you agree to be bound by these
          Terms, our Privacy Policy, and any other guidelines or policies we may
          post. If you do not agree, do not use our services.
        </p>

        <h2>2. Unofficial Platform</h2>
        <p>
          This is a <strong>student-run, unofficial project</strong>. We are not
          affiliated with, endorsed by, or representing the{" "}
          <strong>National Institute of Technology, Hamirpur</strong>. All
          trademarks, logos, and names belong to their respective owners.
        </p>

        <h2>3. Use of Services</h2>
        <ul>
          <li>
            You may use our services only for lawful purposes and in compliance
            with these Terms.
          </li>
          <li>
            You must not misuse, hack, interfere with, or disrupt our services.
          </li>
          <li>
            You must not upload or share illegal, abusive, defamatory,
            infringing, or harmful content.
          </li>
          <li>
            You are responsible for any content you submit, including ensuring
            you have the right to share it.
          </li>
        </ul>

        <h2>4. Academic Data & Privacy</h2>
        <p>
          We may provide access to academic resources (e.g., syllabus,
          results-related tools). This data is provided solely for convenience
          and informational purposes. We do not guarantee accuracy,
          completeness, or timely updates. You are responsible for verifying
          official data with the institute.
        </p>

        <h2>5. No Guarantee of Accuracy</h2>
        <p>
          While we aim to provide helpful and accurate information, all content
          is provided “as is” without warranties of any kind. We disclaim all
          responsibility for errors, omissions, delays, or inaccuracies in
          content.
        </p>

        <h2>6. Advertising & Affiliate Links</h2>
        <p>
          Our Site may contain advertising or affiliate links. We may earn a
          commission when you click or purchase through these links, at no
          additional cost to you. Ads and affiliate content are provided by
          third parties, and we do not control or endorse the products,
          services, or claims.
        </p>

        <h2>7. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, we are not liable for any
          direct, indirect, incidental, special, consequential, or punitive
          damages arising from your use of or inability to use the Site or App.
        </p>

        <h2>8. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless nith.eu.org, its operators,
          contributors, and affiliates from any claims, damages, or expenses
          arising out of your use of the services or violation of these Terms.
        </p>

        <h2>9. Intellectual Property</h2>
        <p>
          Content we create (e.g., original guides, articles, tools, and
          designs) is protected by intellectual property laws. You may not
          reproduce, modify, or distribute our content without permission,
          except as allowed by law or fair use.
        </p>

        <h2>10. Service Changes & Termination</h2>
        <p>
          We may modify, suspend, or discontinue any part of our services at any
          time, with or without notice. We are not liable for any resulting loss
          or inconvenience.
        </p>

        <h2>11. Governing Law</h2>
        <p>
          These Terms are governed by and construed under the laws of India. Any
          disputes shall be subject to the jurisdiction of courts located in
          Himachal Pradesh, India.
        </p>

        <h2>12. Changes to These Terms</h2>
        <p>
          We may update these Terms from time to time. Continued use of the Site
          after changes means you accept the revised Terms.
        </p>

        <h2>13. Contact</h2>
        <p>
          If you have questions about these Terms or this Disclaimer, please
          contact us at{" "}
          <a href="mailto:contact@nith.eu.org">contact@nith.eu.org</a>.
        </p>

        <hr />
        <p>
          <em>
            Disclaimer: This platform is unofficial and not affiliated with the
            National Institute of Technology, Hamirpur. Use of the Site is at
            your own risk. Always confirm official academic information with the
            institute.
          </em>
        </p>
      </article>
    </main>
  );
}
