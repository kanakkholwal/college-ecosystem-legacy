import { BorderBeam } from "@/components/animation/border-beam";
import { RouterCard } from "@/components/common/router-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RocketIcon } from "@radix-ui/react-icons";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "src/lib/auth";

import { quick_links, getLinksByRole } from "@/constants/links";

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const links = getLinksByRole(session?.user?.other_roles[0], quick_links);

  return (
    <>
      <section
        id="hero"
        className="z-10 w-full max-w-7xl max-h-96 relative flex justify-center lg:justify-around items-center gap-10 py-24 px-4 rounded-lg text-center lg:text-left"
        suppressHydrationWarning={true}
      >
        <div className="relative z-50">
          <h2
            className="text-xl md:text-2xl lg:text-4xl font-bold text-neutral-900  whitespace-nowrap"
            data-aos="fade-up"
          >
            {getGreeting()}{" "}
            <span className="text-primary">{session?.user?.name}</span>
          </h2>
          {/* <Greetings/> */}
          {session?.user?.other_roles.includes("student") && (
            <Alert variant="info" className="mt-4" data-aos="fade-right">
              <RocketIcon className="h-4 w-4" />
              <AlertTitle>Join the College Ecosystem Project!</AlertTitle>
              <AlertDescription>
                We are looking for contributors to help us build the platform.
                Check out the
                <Link
                  href="https://github.com/kanakkholwal/college-ecosystem/blob/main/CONTRIBUTING.md"
                  className="underline mx-1"
                >
                  Contribute
                </Link>{" "}
                page for more information.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <BorderBeam />
      </section>
      <section
        id="quick-links"
        className="z-10 w-full max-w-6xl mx-auto relative space-y-4 text-left"
      >
        <h2
          className="text-2xl font-bold text-neutral-900 dark:text-neutral-100"
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
