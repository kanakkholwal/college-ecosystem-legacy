"use client";
import { AnimatedGradientText } from "@/components/animation/animated-shiny-text";
import { FloatingElements } from "@/components/animation/floating-elements";
import { Icon } from "@/components/icons";
import Globe from "@/components/ui/globe";
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
        transition={{ type: "spring", damping: 20, stiffness: 300, delay: 0.1 }}
        viewport={{ once: true, amount: 0.2 }}
        className="relative z-30 flex w-full items-center justify-center flex-col px-4 py-8 bg-background/30 border-muted/30 max-w-xl rounded-3xl border backdrop-blur">

        <motion.h2
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="font-bold tracking-tight mb-4 max-w-5xl mt-10 group relative">
          <AnimatedGradientText
            className={cn(
              user ? "text-base sm:text-3xl" : "text-3xl sm:text-4xl md:text-5xl"
            )}

          >{getGreeting()}
          </AnimatedGradientText> <br />
          <span className="text-3xl sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-secondary dark:from-foreground to-primary">
            {user?.name}
          </span>
        </motion.h2>
        <motion.p initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35, type: "spring", damping: 20, stiffness: 300, delayChildren: 0.1 }}
          className="text-base text-muted-foreground text-center mb-5">
          {appConfig.description.split(".")[0] || "Welcome to the digital campus platform!"}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4"
        >

          <ButtonLink
            variant="dark"
            href={user ? `/${user.other_roles[0]}` : "/auth/sign-in"}
            effect="shineHover"
            transition="damped"
            shadow="dark"
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
        </motion.div>
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






export function IntroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28 px-4 md:px-8 lg:px-12">
      {/* Background gradients */}


      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left: Text content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
            The{" "}
            <span className="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
              College Ecosystem
            </span>
          </h2>

          <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
            An all-in-one platform built for{" "}
            <span className="font-semibold text-foreground">students of NITH</span>.
            From checking your academic results to exploring{" "}
            <span className="font-medium">clubs, societies, and hostel allotment</span> –
            everything you need is in one place.
          </p>

          <div className="mt-8">
            <ButtonLink size="lg" shadow="default" href="#quick-links" >
              Explore Features
            </ButtonLink>
          </div>
        </motion.div>

        {/* Right: Animated illustration / glass card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative justify-center hidden md:flex"
        >
          <Globe />

        </motion.div>
      </div>
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
