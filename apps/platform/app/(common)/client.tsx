"use client";
import { BorderBeam } from "@/components/animation/border-beam";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RocketIcon } from "@radix-ui/react-icons";
import { motion } from "motion/react";
import Link from "next/link";
import type { Session } from "~/lib/auth";
import { appConfig } from "~/project.config";
// import "./greetings.css";

interface HeroSection {
  user: Session["user"];
}

export function HeroSection({ user }: HeroSection) {
  return (
    <section
      id="hero"
      className="z-10 bg-accent w-full max-w-7xl max-h-96 relative flex justify-center lg:justify-around items-center gap-10 py-24 px-4 rounded-lg text-center lg:text-left"
      suppressHydrationWarning={true}
    >
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4 z-50"
      >
        <h2 className="text-3xl font-semibold text-center">
          {getGreeting()} <span className="text-primary">{user?.name}</span>
        </h2>
        <p className="mb-8 text-lg text-muted-foreground">
          Welcome to the {appConfig.name}
        </p>
        {user?.other_roles.includes("student") && (
          <Alert variant="info" className="mt-4" data-aos="fade-right">
            <RocketIcon className="h-4 w-4" />
            <AlertTitle>Join the {appConfig.name} Project!</AlertTitle>
            <AlertDescription>
              We are looking for contributors to help us build the platform.
              Check out the
              <Link
                href={`${appConfig.githubRepo}/blob/main/CONTRIBUTING.md`}
                className="underline mx-1"
              >
                Contribute
              </Link>{" "}
              page for more information.
            </AlertDescription>
          </Alert>
        )}
      </motion.div>
      <BorderBeam />
    </section>
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
