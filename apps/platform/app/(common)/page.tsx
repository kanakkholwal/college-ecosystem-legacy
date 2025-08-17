import { AnimatedTestimonials } from "@/components/animation/animated-testimonials";
import { BackgroundBeamsWithCollision } from "@/components/animation/bg-beam-with-collision";
import { StaggerChildrenContainer, StaggerChildrenItem } from "@/components/animation/motion";
import { HeaderBar } from "@/components/common/header-bar";
import { RouterCard } from "@/components/common/router-card";
import { SkeletonCardArea } from "@/components/utils/skeleton-cards";
import { testimonialsContent } from "@/constants/landing";
import { getLinksByRole, quick_links } from "@/constants/links";
import { Newspaper } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getPublicStats } from "~/actions/public";
import type { Session } from "~/auth";
import { getSession } from "~/auth/server";
import { ROLES_ENUMS } from "~/constants";
import { getAllResources } from "~/lib/markdown/mdx";
import { appConfig } from "~/project.config";
import { FeatureSection, IntroSection } from "./client";
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
  const publicStats = await getPublicStats();
  const resources = await getAllResources(RESOURCES_LIMIT);

  return (
    <div className="flex flex-col w-full flex-1 gap-12 px-4 md:px-6 pt-4 md:pt-6 xl:px-12 xl:mx-auto max-w-6xl max-sm:pb-16">
      {/* SEO Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: appConfig.name,
          url: appConfig.url,
          applicationCategory: "Education",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "INR",
          },
          operatingSystem: "Web",
          featureList: [
            "Exam Results",
            "Course Syllabus",
            "Classroom Availability",
            "Academic Schedules",
            ...appConfig.keywords,
          ],
        })}
      </script>

      {/* Intro */}
      <BackgroundBeamsWithCollision className="md:h-auto md:min-h-96">
        <IntroSection user={session?.user} stats={publicStats} />
      </BackgroundBeamsWithCollision>

      {/* Quick Links */}
      <StaggerChildrenContainer id="quick-links" className="space-y-6">
        <h2 className="text-xl font-semibold">
          Explore Results, Room Allotment, and More
        </h2>
        <StaggerChildrenItem className="grid grid-cols-1 @md:grid-cols-2 @4xl:grid-cols-4 gap-4">
          {links.map((link, i) => (
            <RouterCard
              key={link.href}
              {...link}
              style={{ animationDelay: `${i * 500}ms` }}
            />
          ))}
        </StaggerChildrenItem>
      </StaggerChildrenContainer>

      {/* Feed Placeholder */}
      <StaggerChildrenContainer className="space-y-4" id="feed">
        <HeaderBar
          Icon={Newspaper}
          titleNode="Latest Updates"
          descriptionNode="Stay updated with announcements, guides, and student-written posts."
          className="mb-8"
        />
        <Suspense fallback={<SkeletonCardArea count={RESOURCES_LIMIT} />}>
          <ResourcesList resources={resources} showImage={false} />
        </Suspense>
      </StaggerChildrenContainer>

      <FeatureSection />
      <StaggerChildrenContainer className="space-y-4" id="testimonials">
        <h2 className="text-xl font-semibold text-center">
          What Students Are Saying
        </h2>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Hear from your peers about how the College Ecosystem is transforming
          campus life.
        </p>
        <AnimatedTestimonials data={testimonialsContent} />
      </StaggerChildrenContainer>
    </div>
  );
}
