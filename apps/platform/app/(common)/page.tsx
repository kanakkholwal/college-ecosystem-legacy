import { AnimatedTestimonials } from "@/components/animation/animated-testimonials";
import { BackgroundBeamsWithCollision } from "@/components/animation/bg-beam-with-collision";
import { RouterCard } from "@/components/common/router-card";
import { SkeletonCardArea } from "@/components/utils/skeleton-cards";
import { getLinksByRole, quick_links } from "@/constants/links";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import type { Session } from "~/auth";
import { getSession } from "~/auth/server";
import { ROLES_ENUMS } from "~/constants";
import { getAllResources } from "~/lib/markdown/mdx";
import { appConfig } from "~/project.config";
import { HeroSection, IntroSection } from "./client";
import { ResourcesList } from "./resources/client";

const RESOURCES_LIMIT = 6; // Limit the number of resources fetched

export default async function HomePage() {
  const session = (await getSession()) as Session;
  const links = getLinksByRole(session?.user?.other_roles[0], quick_links);

  if (
    session?.user.other_roles.includes(ROLES_ENUMS.GUARD) &&
    session?.user.role !== ROLES_ENUMS.ADMIN
  ) {
    return redirect(`/${ROLES_ENUMS.GUARD}`);
  }
  const resources = await getAllResources(RESOURCES_LIMIT);
  return (
    <div className="flex flex-col w-full flex-1 gap-12 px-4 md:px-6 pt-4 md:pt-6 xl:px-12 xl:mx-auto max-w-6xl max-sm:pb-16">
      {/* SEO Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": appConfig.name,
          "url": appConfig.url,
          "applicationCategory": "Education",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR",
          },
          "operatingSystem": "Web",
          "featureList": [
            "Exam Results",
            "Course Syllabus",
            "Classroom Availability",
            "Academic Schedules",
            ...appConfig.keywords,
          ],
        })}
      </script>

      {/* Hero */}
      <BackgroundBeamsWithCollision>
        <HeroSection user={session?.user} />
      </BackgroundBeamsWithCollision>

      <IntroSection />

      {/* Quick Links */}
      <section id="quick-links" className="space-y-6">
        <h2 className="text-xl font-semibold">Explore Results, Room Allotment, and More</h2>
        <div className="grid grid-cols-1 @md:grid-cols-2 @4xl:grid-cols-4 gap-4">
          {links.map((link, i) => (
            <RouterCard
              key={link.href}
              {...link}
              style={{ animationDelay: `${i * 500}ms` }}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="grid gap-8 md:grid-cols-3 text-center">
        <div className="p-6 rounded-2xl shadow bg-card">
          <h3 className="font-semibold text-lg">Results & Rankings</h3>
          <p className="text-sm text-muted-foreground">
            Access your semester results, CGPI, and ranks with ease.
          </p>
        </div>
        <div className="p-6 rounded-2xl shadow bg-card">
          <h3 className="font-semibold text-lg">Hostel Allotment</h3>
          <p className="text-sm text-muted-foreground">
            Get transparent, merit-based room allocations powered by CGPI and preferences.
          </p>
        </div>
        <div className="p-6 rounded-2xl shadow bg-card">
          <h3 className="font-semibold text-lg">Clubs & Societies</h3>
          <p className="text-sm text-muted-foreground">
            Discover, join, and engage with campus clubs and student societies.
          </p>
        </div>
      </section>

      {/* Feed Placeholder */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Latest Updates</h2>
        <p className="text-sm text-muted-foreground">
          Stay updated with announcements, guides, and student-written posts.
        </p>
        <Suspense fallback={<SkeletonCardArea count={RESOURCES_LIMIT} />}>
          <ResourcesList resources={resources} showImage={false} />
        </Suspense>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-center">
          What Students Are Saying
        </h2>
        <p className="text-sm text-muted-foreground">
          Hear from your peers about how the College Ecosystem is transforming campus life.
        </p>
        <AnimatedTestimonials
          data={[
            {
              description:
                "The College Ecosystem saved me so much time during hostel allotment. I could check availability and confirm my room without running around campus.",
              image: "https://i.pravatar.cc/150?img=11",
              name: "Ankit Sharma",
              handle: "@21122",
            },
            {
              description:
                "Finally, one place where I can check my results and explore clubs at NITH. This platform makes campus life smoother and more connected.",
              image: "https://i.pravatar.cc/150?img=22",
              name: "Priya Thakur",
              handle: "@21147",
            },
            {
              description:
                "I love how easy it is to discover societies and events. Before this, I missed out on so many activities. Now it’s all in one dashboard.",
              image: "https://i.pravatar.cc/150?img=33",
              name: "Rahul Mehta",
              handle: "@21089",
            },
            {
              description:
                "The UI is modern and simple to use. Whether I need my academic results or hostel info, I don’t have to juggle multiple sites anymore.",
              image: "https://i.pravatar.cc/150?img=44",
              name: "Sneha Kapoor",
              handle: "@21201",
            },
            {
              description:
                "The College Ecosystem really bridges academics and social life at NITH. Joining clubs and staying updated has never been this easy.",
              image: "https://i.pravatar.cc/150?img=55",
              name: "Aditya Verma",
              handle: "@21057",
            },
          ]}
        />

      </section>


    </div>
  );
}
