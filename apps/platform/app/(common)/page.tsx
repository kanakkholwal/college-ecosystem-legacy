import { RouterCard } from "@/components/common/router-card";
import { getLinksByRole, quick_links } from "@/constants/links";
import type { Session } from "~/lib/auth";
import { getSession } from "~/lib/auth-server";
import { HeroSection } from "./greeting";

export default async function Dashboard() {
  const session = (await getSession()) as Session;

  const links = getLinksByRole(session?.user?.other_roles[0], quick_links);

  return (
    <>
      <HeroSection user={session?.user}/>
      <section
        id="quick-links"
        className="z-10 w-full max-w-6xl mx-auto relative space-y-4 text-left"
      >
        <h2
          className="text-lg md:text-2xl lg:text-4xl font-bold whitespace-nowrap text-neutral-900 dark:text-neutral-100"
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
    </>
  );
}

function getGreeting(): string {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return "Good morning!";
  }
  if (currentHour >= 12 && currentHour < 18) {
    return "Good afternoon!";
  }
  return "Good evening!";
}
