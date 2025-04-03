import { RouterCard } from "@/components/common/router-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { quick_links } from "@/constants/links";
import { RocketIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { getSession } from "~/lib/auth-server";

export default async function StudentDashboard() {
  const session = await getSession();

  return (
    <div className="w-full mx-auto space-y-5">

      <section
        id="quick_links"
        className="mb-32 grid  lg:mb-0 lg:w-full mx-auto @5xl:max-w-6xl grid-cols-1 @md:grid-cols-2 @4xl:grid-cols-4 text-left gap-4"
      >
        {quick_links.map((link, i) => (
          <RouterCard
            key={link.href}
            {...link}
            style={{
              animationDelay: `${i * 500}ms`,
            }}
          />
        ))}
      </section>
    </div>
  );
}
