"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ButtonLink } from "@/components/utils/link";
import { RocketIcon } from "@radix-ui/react-icons";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import type { Session } from "~/lib/auth";
import { appConfig } from "~/project.config";
// import "./greetings.css";

interface HeroSection {
  user: Session["user"];
}

export function HeroSection({ user }: HeroSection) {
  return (
    <motion.section
      initial={{ opacity: 0.0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.3,
        duration: 0.8,
        ease: "easeInOut",
      }}
      className="z-10 w-full max-w-7xl max-h-96 relative flex flex-col gap-4 items-center justify-center py-24 px-2 sm:px-4 rounded-lg text-center lg:text-left"
      suppressHydrationWarning={true}
    >
      
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
      <h2 className="text-3xl font-semibold text-center mt-10">
        {getGreeting()} <span className="bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-primary via-violet-500 to-pink-500">{user?.name}</span>
      </h2>
      <p className="mb-8 text-base text-muted-foreground text-center truncate line-clamp-3">
        {appConfig.description.split(". ")[0] || "Welcome to the digital campus platform!"}
      </p>
      {(user?.other_roles.includes("student") || !user) && (
        <Alert variant="default" className="mt-4 max-w-4xl border bg-card/50 backdrop-blur-md" data-aos="fade-right">
          <RocketIcon className="h-4 w-4" />
          <AlertTitle className="text-left">
            Join the {appConfig.name} Project!
          </AlertTitle>
          <AlertDescription className="text-sm text-muted-foreground text-left line-clamp-3">
            Join our open-source initiative to enhance the digital campus experience for everyone. Your contributions—whether code, designs, ideas, or feedback—will help shape the future of campus technology.
          </AlertDescription>
            <ButtonLink
              size="sm"
              variant="rainbow"
              target="_blank"
              href={`https://github.com/${appConfig.githubUri}/blob/main/CONTRIBUTING.md`}
              className="mr-auto mt-2"
            >
              Contribute Now <ArrowUpRight />
            </ButtonLink>
        </Alert>
      )}
    </motion.section>
  );
}
function getGreeting(): string {
  const currentHour = new Date().getHours();

  if (currentHour >= 5 && currentHour < 12) {
    return "Good morning!";
  }
  if (currentHour >= 12 && currentHour < 17) {
    return "Good afternoon!";
  }
  return "Good evening!";
}
