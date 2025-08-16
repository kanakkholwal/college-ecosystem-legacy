"use client";

import { AnimatedGradientText } from "@/components/animation/animated-shiny-text";
import { FloatingElements } from "@/components/animation/floating-elements";
import { NumberTicker } from "@/components/animation/number-ticker";
import FeatureCard from "@/components/common/feature-card";
import { Icon } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonLink } from "@/components/utils/link";
import { featuresSectionContent } from "@/constants/landing";
import { cn } from "@/lib/utils";
import { spring } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  FileText,
  Globe,
  GraduationCap,
  Home,
  MoreHorizontal,
  Sparkles,
  Star,
  User,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import type { Session } from "~/auth";
import { PublicStatsType } from "~/lib/third-party/github";
import { appConfig, orgConfig } from "~/project.config";
import { getGreeting } from "~/utils/misc";

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
        className="relative z-30 flex w-full items-center justify-center flex-col px-4 py-8 bg-background/30 border-muted/30 max-w-xl rounded-3xl border backdrop-blur"
      >
        <motion.h2
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="font-bold tracking-tight mb-4 max-w-5xl mt-10 group relative"
        >
          <AnimatedGradientText
            className={cn(
              user
                ? "text-base sm:text-3xl"
                : "text-3xl sm:text-4xl md:text-5xl"
            )}
          >
            {getGreeting()}
          </AnimatedGradientText>{" "}
          <br />
          <span className="text-3xl sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-secondary dark:from-foreground to-primary">
            {user?.name}
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: 0.35,
            type: "spring",
            damping: 20,
            stiffness: 300,
            delayChildren: 0.1,
          }}
          className="text-base text-muted-foreground text-center mb-5"
        >
          {appConfig.description.split(".")[0] ||
            "Welcome to the digital campus platform!"}
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
    </div>
  );
}

const bentoVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: spring, stiffness: 100 },
  },
};

export function IntroSection({
  user,
  stats,
}: {
  user: Session["user"];
  stats: PublicStatsType;
}) {
  return (
    <section
      className="z-10 relative mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-8 rounded-lg py-24 lg:text-left"
      suppressHydrationWarning
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          "relative z-[100] flex w-full flex-col items-center justify-center px-4 text-center lg:flex-row lg:items-start lg:justify-between lg:text-left"
        )}
      >
        {/* LEFT: value prop, CTAs, badges, stats */}
        <motion.div
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 300,
            delay: 0.05,
          }}
          className="relative z-30 flex w-full max-w-xl flex-1 flex-col items-start justify-center rounded-3xl border border-muted/40 bg-background/60 px-6 py-8 backdrop-blur"
        >
          {/* Pill */}
          <motion.div
            variants={itemVariants}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
          >
            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-white">
              New
            </span>
            Introducing {appConfig.name}
          </motion.div>

          {/* Headline — value-first */}
          <motion.h1
            variants={itemVariants}
            className="mb-3 bg-gradient-to-r from-foreground via-foreground to-muted-foreground/80 bg-clip-text text-3xl font-extrabold leading-tight text-transparent sm:text-4xl"
          >
            All-in-One Ecosystem for {orgConfig.shortName} Students
          </motion.h1>

          {/* Subheadline + personal greeting (kept, but secondary) */}
          <motion.p
            variants={itemVariants}
            className="mb-2 text-sm text-muted-foreground font-semibold"
          >
            {getGreeting()}{" "}
            {user?.name ? (
              <>
                <span className="mx-1">•</span>
                <AnimatedGradientText className="font-semibold">
                  {user.name}
                </AnimatedGradientText>
              </>
            ) : null}
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="mb-6 max-w-prose text-base leading-relaxed text-muted-foreground"
          >
            {appConfig.description}
          </motion.p>

          {/* Primary + secondary CTAs (anchors & props preserved) */}
          <motion.div
            variants={itemVariants}
            className="mt-2 flex flex-wrap items-center gap-4"
          >
            <ButtonLink size="lg" href="#quick-links">
              Explore Features <Icon name="arrow-right" />
            </ButtonLink>
            <ButtonLink
              size="lg"
              variant="outline"
              target="_blank"
              transition="damped"
              href={`https://github.com/${appConfig.githubUri}/blob/main/CONTRIBUTING.md`}
            >
              <Icon name="github" />
              Contribute Now
              <Icon name="arrow-up-right" />
            </ButtonLink>
          </motion.div>

          {/* Popular badges (kept) */}
          <motion.div
            variants={itemVariants}
            className="mb-6 mt-5 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <span className="text-sm font-semibold text-muted-foreground">
              Popular Features
            </span>

            <Link
              href="/results"
              className="group flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-card-foreground shadow-sm transition-all hover:border-primary hover:bg-primary/5"
            >
              <FileText className="h-4 w-4 text-blue-500 transition-colors group-hover:text-primary" />
              Results
            </Link>

            <Link
              href="/resources"
              className="group flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-card-foreground shadow-sm transition-all hover:border-primary hover:bg-primary/5"
            >
              <BookOpen className="h-4 w-4 text-purple-500 transition-colors group-hover:text-primary" />
              Resources
            </Link>

            <Link
              href="/communities"
              className="group flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-card-foreground shadow-sm transition-all hover:border-primary hover:bg-primary/5"
            >
              <Users className="h-4 w-4 text-green-500 transition-colors group-hover:text-primary" />
              Communities
            </Link>

            <Link
              href="#quick-links"
              className="group flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-card-foreground shadow-sm transition-all hover:border-primary hover:bg-primary/5"
            >
              <MoreHorizontal className="h-4 w-4 text-yellow-500 transition-colors group-hover:text-primary" />
              +5 more
            </Link>
          </motion.div>

          {/* Bento stats (kept props, upgraded layout) */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap w-full max-w-lg gap-3"
          >
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm backdrop-blur flex-auto">
              <div className="mb-1 inline-flex items-center gap-2">
                <User className="h-5 w-5 text-cyan-500" />
                <NumberTicker
                  value={stats.userCount}
                  className="text-xl font-bold"
                  suffix="+"
                />
              </div>
              <p className="text-xs text-muted-foreground">Users on platform</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm backdrop-blur flex-auto">
              <div className="mb-1 inline-flex items-center gap-2">
                <Globe className="h-5 w-5 text-emerald-500" />
                <NumberTicker
                  value={stats.githubStats.visitors}
                  className="text-xl font-bold"
                  suffix="+"
                />
              </div>
              <p className="text-xs text-muted-foreground">Total Visitors</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm backdrop-blur sm:col-span-1 flex-auto">
              <div className="mb-1 inline-flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <NumberTicker
                  value={stats.githubStats.stars}
                  className="text-xl font-bold"
                  suffix="+"
                />
              </div>
              <p className="text-xs text-muted-foreground">Stars on Github</p>
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT: visual anchor + dashboard/sign-in + social proof (anchors & props preserved) */}
        <div className="mt-6 flex flex-1 flex-col items-center lg:items-end">
          {/* Screenshot / preview placeholder */}
          <motion.div
            variants={itemVariants}
            className="mb-6 w-full max-w-md rounded-2xl border border-border bg-card shadow-xl backdrop-blur-sm"
          >
            <HeroBentoMockup />
          </motion.div>

          <motion.div variants={itemVariants} className="mb-6">
            <ButtonLink
              variant="dark"
              size="lg"
              href={user ? `/${user.other_roles[0]}` : "/auth/sign-in"}
              effect="shineHover"
              transition="damped"
              width="sm"
              shadow="dark"
            >
              <Icon name="chart-candlestick" />
              {user ? "Go to Your Dashboard" : "Sign In to Your Account"}{" "}
              <Icon name="arrow-right" />
            </ButtonLink>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="mb-6 max-w-md px-2 text-center text-lg leading-relaxed text-pretty text-muted-foreground lg:text-right"
          >
            {appConfig.description}
          </motion.p>

          {/* Social proof */}
          <motion.div
            variants={itemVariants}
            className="mx-auto flex items-center gap-3 rounded-full border border-border bg-card/60 px-3 py-1 backdrop-blur-sm lg:mx-0"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="size-6 overflow-hidden rounded-full border-2 border-card bg-border"
                >
                  <div className="h-full w-full bg-gradient-to-br from-primary/50 to-tertiary/20 opacity-80" />
                </div>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              <NumberTicker
                value={stats.sessionCount}
                className="font-semibold"
                suffix="+"
              />{" "}
              active users right now
            </span>
            <ArrowUpRight className="h-3 w-3 text-primary" />
          </motion.div>
        </div>
      </motion.div>

      <FloatingElements />

      {/* Decorative beams */}
      <div className="absolute left-1/2 right-auto -bottom-40 h-96 w-20 -translate-x-1/2 -rotate-45 rounded-full bg-gray-200/30 blur-[80px] lg:left-auto lg:right-96 lg:translate-x-0" />
      <div className="absolute left-1/2 right-auto -bottom-52 h-96 w-20 -translate-x-1/2 -rotate-45 rounded-full bg-gray-300/20 blur-[80px] lg:left-auto lg:right-auto lg:translate-x-0" />
      <div className="absolute left-1/2 right-auto -bottom-60 h-96 w-10 -translate-x-20 -rotate-45 rounded-full bg-gray-300/20 blur-[80px] lg:left-auto lg:right-96 lg:-translate-x-40" />
    </section>
  );
}

export function HeroBentoMockup() {
  return (
    <motion.div
      variants={bentoVariants}
      initial="hidden"
      animate="show"
      className="grid w-full max-w-lg grid-cols-2 gap-4"
    >
      <div className="absolute -top-4 right-0 z-10 bg-gradient-to-r from-primary to-primary/60 px-3 py-1 text-xs font-semibold text-white rounded-full shadow-md animate-pulse">
        Preview / Demo Only
      </div>

      {/* Result Card */}
      <Card className="col-span-2 bg-gradient-to-br from-primary/10 to-background backdrop-blur">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <GraduationCap className="h-4 w-4 text-primary" />
            Results
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p className="font-medium">
            CGPI: <span className="text-primary">9.2</span>
          </p>
          <div className="mt-2 h-2 w-full rounded-full bg-muted">
            <div className="h-2 w-[80%] rounded-full bg-primary"></div>
          </div>
        </CardContent>
      </Card>

      {/* Hostel Card */}
      <Card className="rounded-2xl border border-border bg-card shadow-sm">
        <CardHeader className="pb-1">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Home className="h-4 w-4 text-primary" />
            Hostel
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          Room 204 · 3 Seater
          <p className="text-foreground font-semibold">Allotted ✅</p>
        </CardContent>
      </Card>

      {/* Clubs Card */}
      <Card className="rounded-2xl border border-border bg-card shadow-sm">
        <CardHeader className="pb-1">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-primary" />
            Upcoming Hackathon
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs">
          Hackathon 2025
          <p className="text-muted-foreground">Starts in 3 days</p>
        </CardContent>
      </Card>

      {/* Users Card */}
      <Card className="col-span-2 rounded-2xl border border-border bg-gradient-to-r from-primary/5 to-card shadow pt-5">
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold">12,000+</p>
            <p className="text-xs text-muted-foreground">Students Connected</p>
          </div>
          <Users className="h-6 w-6 text-primary" />
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function FeatureSection() {
  return (
    <section className="pt-20 pb-8" id="features">
      <div className="mx-6 max-w-[1120px] pt-2 pb-16 max-[300px]:mx-4 min-[1150px]:mx-auto">
        <div className="flex flex-col-reverse gap-6 md:grid md:grid-cols-3">
          {/* Left column */}
          <div className="flex flex-col gap-6">
            {featuresSectionContent.left.map((feature, index) => (
              <FeatureCard key={`left-feature-${index}`} feature={feature} />
            ))}
          </div>

          {/* Center column */}
          <div className="order-[1] mb-6 self-center sm:order-[0] md:mb-0">
            <div className="bg-bard text-foreground ring-border relative mx-auto mb-4.5 w-fit rounded-full rounded-bl-[2px] px-4 py-2 text-sm ring">
              <AnimatedGradientText className="relative z-1 flex items-center gap-2 font-semibold">
                <Sparkles className="size-3 text-yellow-400 animate-spin animation-duration-3000" />{" "}
                Features
              </AnimatedGradientText>
              <span className="from-primary/0 via-primary to-primary/0 absolute -bottom-px left-1/2 h-px w-2/5 -translate-x-1/2 bg-gradient-to-r"></span>
              <span className="absolute inset-0 bg-[radial-gradient(30%_40%_at_50%_100%,hsl(var(--primary)/0.25)_0%,transparent_100%)]"></span>
            </div>
            <h2 className="text-foreground mb-2 text-center text-2xl sm:mb-2.5 md:text-[2rem] font-semibold">
              Why Use College Ecosystem?
            </h2>
            <p className="text-muted-foreground mx-auto max-w-[22rem] text-center text-pretty">
              Your one-stop platform for academic results, hostel allotments,
              club activities, and everything that makes campus life simpler and
              smarter.
            </p>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            {featuresSectionContent.right.map((feature, index) => (
              <FeatureCard key={`right-feature-${index}`} feature={feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
