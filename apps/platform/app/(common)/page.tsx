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
import { HeroSection } from "./client";
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

      {/* Intro Section */}
      <section className="prose dark:prose-invert max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold">Welcome to {appConfig.name}</h2>
        <p>
          The College Ecosystem is an all-in-one platform built for students of
          NITH. From checking your academic results to exploring clubs,
          societies, and hostel allotment – everything you need is in one place.
        </p>
        <p>
          Our goal is to simplify campus life with tools, resources, and
          community features that empower students both academically and socially.
        </p>
      </section>

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
        <h2 className="text-xl font-semibold">Latest Updates</h2>
        <p className="text-sm text-muted-foreground">
          Stay updated with announcements, guides, and student-written posts.
        </p>
        <AnimatedTestimonials

          data={[{
            description:
              "ScrollX-UI has completely transformed how I build interfaces. The animations are silky smooth, and the components are modular and responsive.",
            image:
              "https://images.unsplash.com/photo-1611558709798-e009c8fd7706?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
              name: "Isabelle Carlos",
              handle: "@isabellecarlos",
            },
            {
              description:
                "I love how ScrollX-UI makes my projects look professional with minimal effort. The documentation is clear and the community is super helpful.",
              image:
                "https://plus.unsplash.com/premium_photo-1692340973636-6f2ff926af39?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
              name: "Lana Akash",
              handle: "@lanaakash",
            },
            {
              description:
                "The smooth scrolling animations and intuitive components in ScrollX-UI save me hours of development time!",
              image:
                "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
              name: "Liam O’Connor",
              handle: "@liamoc",
            },
            {
              description:
                "Using ScrollX-UI feels like magic — it’s so easy to create beautiful, interactive UIs without writing complex code.",
              image:
                "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
              name: "Isabella Mendes",
              handle: "@isamendes",
            },
            {
              description:
                "ScrollX-UI’s open-source nature means I can customize components exactly how I want them — plus, the performance is outstanding.",
              image:
                "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
              name: "Meera Patel",
              handle: "@meerapatel",
            },
            {
              description:
                "I recommend ScrollX-UI to everyone looking for a powerful, flexible UI library with stunning animation support.",
              image:
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
              name: "Emily Chen",
              handle: "@emchen",
            },
          ]}
        />
      </section>


    </div>
  );
}
