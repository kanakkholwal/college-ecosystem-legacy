import { BackgroundBeamsWithCollision } from "@/components/animation/bg-beam-with-collision";
import { RouterCard } from "@/components/common/router-card";
import { getLinksByRole, quick_links } from "@/constants/links";
import { redirect } from "next/navigation";
import type { Session } from "~/auth";
import { getSession } from "~/auth/server";
import { ROLES_ENUMS } from "~/constants";
import { appConfig } from "~/project.config";
import { HeroSection } from "./client";

export default async function Dashboard() {
  const session = (await getSession()) as Session;

  const links = getLinksByRole(session?.user?.other_roles[0], quick_links);
  if (
    session?.user.other_roles.includes(ROLES_ENUMS.GUARD) &&
    session?.user.role !== ROLES_ENUMS.ADMIN
  ) {
    return redirect(`/${ROLES_ENUMS.GUARD}`);
  }
  return (
    <div className="flex w-full flex-1 flex-col gap-6 px-4 md:px-6 pt-4 md:pt-6 xl:px-12 xl:mx-auto max-w-6xl max-sm:pb-16">
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
            "priceCurrency": "INR"
          },
          "operatingSystem": "Web",
          "featureList": [
            "Exam Results",
            "Course Syllabus",
            "Classroom Availability",
            "Academic Schedules",
            ...appConfig.keywords
          ]
        })}
      </script>
      <BackgroundBeamsWithCollision>
        <HeroSection user={session?.user} />
      </BackgroundBeamsWithCollision>
      <section
        id="quick-links"
        className="z-10 w-full max-w-6xl mx-auto relative space-y-4 text-left"
      >
        <h2
          className="text-xl font-semibold whitespace-nowrap "
          data-aos="fade-right"
          data-aos-duration="500"
        >
          Quick Links
        </h2>

        <div className="mb-32 grid  lg:mb-0 lg:w-full mx-auto @5xl:max-w-6xl grid-cols-1 @md:grid-cols-2 @4xl:grid-cols-4 text-left gap-4">
          {links.map((link, i) => (
            <RouterCard
              key={link.href}
              {...link}
              style={{
                animationDelay: `${i * 500}ms`,
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
