"use client";
import { AnimatedGradientText } from "@/components/animation/animated-shiny-text";
import { FloatingElements } from "@/components/animation/floating-elements";
import { Icon } from "@/components/icons";
import { ButtonLink } from "@/components/utils/link";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import type { Session } from "~/auth";
import { appConfig } from "~/project.config";


interface HeroSection {
  user: Session["user"];
}

export function HeroSection({ user }: HeroSection) {
  return (
    <div
      id="hero-section"
      className="z-10 w-full max-w-7xl max-h-96 relative flex flex-col gap-4 items-center justify-center py-24 px-2 sm:px-4 rounded-lg text-center lg:text-left"
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
        className="relative z-30 flex w-full items-center justify-center flex-col px-4 py-8 bg-background/30 border-muted/30 max-w-xl rounded-3xl border backdrop-blur">

        <h2 className="font-bold tracking-tight mb-4 max-w-5xl mt-10 group relative">
          <AnimatedGradientText
            className={cn(
              user ? "text-base sm:text-3xl" : "text-3xl sm:text-4xl md:text-5xl"
            )}

          >{getGreeting()}
          </AnimatedGradientText> <br />
          <span className="text-3xl sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-black/30 dark:from-foreground to-primary">
            {user?.name}
          </span>
        </h2>
        <p className="text-base text-muted-foreground text-center mb-5">
          {appConfig.description.split(".")[0] || "Welcome to the digital campus platform!"}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">

          <ButtonLink
            variant="dark"
            href={user ? `/${user.other_roles[0]}` : "/auth/sign-in"}
            effect="shineHover"
            transition="damped"
          >
            <Icon name="chart-candlestick" />
            {user ? "Dashboard" : "Sign In"} <Icon name="arrow-right" />
          </ButtonLink>
          <ButtonLink
            variant="outline"
            target="_blank"
            transition="scale"
            href={`https://github.com/${appConfig.githubUri}/blob/main/CONTRIBUTING.md`}
          >
            <Icon name="github" />
            Contribute Now
            <Icon name="arrow-up-right" />
          </ButtonLink>
        </div>
      </motion.div>
      <FloatingElements />

      {/* {(user?.other_roles.includes("student") || !user) && (
        <Alert variant="default" className="mt-4 max-w-4xl border bg-card/50 backdrop-blur-md" data-aos="fade-right">
          <RocketIcon className="size-4" />
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
      )} */}
    </div>
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
