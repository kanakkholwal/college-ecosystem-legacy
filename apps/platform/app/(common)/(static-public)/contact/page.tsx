// app/contact/page.tsx
import type { Metadata } from "next";
import { appConfig } from "~/project.config";

export const metadata: Metadata = {
  title: "About & Contact",
  description:
    "Learn about nith.eu.org and app.nith.eu.org. Get in touch with the team and understand the mission, unofficial nature, and contact details.",
  robots: { index: true, follow: true },
};

export default function AboutPage() {
  return (
    <main className="px-4 py-10 md:py-16">
      <article className="prose prose-zinc dark:prose-invert max-w-none">
        <h1>About & Contact</h1>
        <p>
          <strong>nith.eu.org</strong> and{" "}
          <strong>app.nith.eu.org</strong> are student-run platforms built for
          the <strong>NIT Hamirpur</strong> community. Our mission is to provide
          resources, tools, and community features that help students access
          information and collaborate more easily.
        </p>

        <h2>Unofficial Project</h2>
        <p>
          This is an <strong>independent, unofficial project</strong>. It is not
          affiliated with, endorsed by, or officially representing{" "}
          <strong>National Institute of Technology, Hamirpur</strong>. All
          trademarks and names belong to their respective owners.
        </p>

        <h2>Our Mission</h2>
        <ul>
          <li>Provide a central hub for academic resources, results, and guides.</li>
          <li>Enable student collaboration and communication.</li>
          <li>Offer open-source, transparent tools to improve the student experience.</li>
        </ul>

        <h2>Transparency & Community</h2>
        <p>
          We believe in open development and transparency. Features evolve based
          on student needs, community input, and contributions. If you have
          suggestions or want to contribute, we’d love to hear from you.
        </p>

        <h2>Contact Us</h2>
        <p>
          For questions, suggestions, feedback, or concerns, please reach out:
        </p>
        <ul>
          <li>
            <strong>Email:</strong>{" "}
            <a href="mailto:contact@nith.eu.org">contact@nith.eu.org</a>
          </li>
          <li>
            <strong>Contact Form:</strong>{" "}
            <a href={appConfig.contact}>Contact Us</a>
          </li>
          <li>
            <strong>GitHub:</strong>{" "}
            <a
              href="https://github.com/kanakkholwal/college-ecosystem"
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/college-ecosystem
            </a>
          </li>
        </ul>

        <h2>Disclaimer</h2>
        <p>
          While we strive to provide accurate and helpful information, the
          content on this site is provided “as is” with no guarantees. Always
          verify official academic or administrative details with NIT Hamirpur.
        </p>

        <hr />
        <p>
          <em>
            This platform is unofficial and operated by students. It exists to
            assist peers, not to replace or duplicate official institute
            services.
          </em>
        </p>
      </article>
    </main>
  );
}
