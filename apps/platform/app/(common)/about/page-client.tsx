"use client";

import { MagicCard } from "@/components/animation/magic-card";
import { NumberTicker } from "@/components/animation/number-ticker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonLink } from "@/components/utils/link";
import { motion, useInView, Variants } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  Code2,
  Cpu,
  Database,
  ExternalLink,
  Eye,
  GitFork,
  Github,
  Globe,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRef } from "react";
import { appConfig, orgConfig } from "~/project.config";
import { content } from "./content";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const scaleOnHover = {
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 },
  },
};
const techStack = [
  {
    name: "Next.js + Express.js",
    icon: Globe,
    description: "Full-stack architecture",
  },
  { name: "TypeScript", icon: Code2, description: "Type-safe development" },
  {
    name: "Tailwind CSS",
    icon: Cpu,
    description: "Utility-first CSS framework",
  },
  {
    name: "Postgres + MongoDB",
    icon: Database,
    description: "Flexible database solutions",
  },
];

const keyFeatures = [
  {
    name: "Lightning Fast",
    icon: Zap,
    description: "Optimized for performance with server-side rendering",
  },
  {
    name: "Scalable Architecture",
    icon: Code2,
    description: "Built to handle thousands of users",
  },
  {
    name: "Open Source",
    icon: Github,
    description: "Community-driven development with transparent codebase",
  },
];

interface AboutPageProps {
  contributors: Array<{
    name: string;
    username: string;
    avatar: string;
    contributions: number;
  }>;
  stats: {
    stars: number;
    forks: number;
    contributors: number;
    visitors: number;
  };
}
export default function AboutPage({ contributors, stats }: AboutPageProps) {
  const { resolvedTheme } = useTheme();
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const techRef = useRef(null);
  const communityRef = useRef(null);
  const gettingStartedRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const statsInView = useInView(statsRef, { once: true });
  const techInView = useInView(techRef, { once: true });
  const communityInView = useInView(communityRef, { once: true });
  const gettingStartedInView = useInView(gettingStartedRef, { once: true });

  const statsMapping = [
    { icon: Eye, label: "Visitors", value: stats.visitors, suffix: "+" },
    { icon: Star, label: "GitHub Stars", value: stats.stars, suffix: "+" },
    { icon: GitFork, label: "Forks", value: stats.forks, suffix: "+" },
    {
      icon: Users,
      label: "Contributors",
      value: stats.contributors,
      suffix: "+",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 py-24 lg:py-32"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="max-w-5xl mx-auto text-center"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
            >
              {content.headline}
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              {content.description}
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <ButtonLink
                href={appConfig.githubRepo}
                variant="rainbow"
                target="_blank"
                size="lg"
                effect="expandIcon"
              >
                <Github />
                View on GitHub
                <ChevronRight className="icon" />
              </ButtonLink>
              <ButtonLink
                size="lg"
                variant="outline"
                href={content.wiki_url}
                target="_blank"
                effect="expandIcon"
              >
                <BookOpen />
                Documentation
                <ChevronRight className="icon" />
              </ButtonLink>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Platform Statistics */}
      <section ref={statsRef} className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="max-w-6xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Platform Impact
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our growing community continues to drive innovation in
                educational technology
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsMapping.map((stat, index) => (
                <motion.div key={index} variants={fadeInUp} whileHover="hover">
                  <motion.div variants={scaleOnHover}>
                    <MagicCard
                      gradientColor={
                        resolvedTheme === "dark" ? "#262626" : "#D9D9D955"
                      }
                      layerClassName="bg-card"
                      className="rounded-lg text-center hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="pt-6">
                        <stat.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                        <div className="text-3xl font-bold mb-2 text-primary">
                          <NumberTicker
                            value={stat.value}
                            className="inline-block ml-2"
                            suffix={stat.suffix}
                          />
                        </div>
                        <p className="text-muted-foreground">{stat.label}</p>
                      </CardContent>
                    </MagicCard>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Technical Overview */}
      <section ref={techRef} className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate={techInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="max-w-6xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Built for Scale & Performance
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Modern architecture designed for reliability, security, and
                exceptional user experience
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              <motion.div variants={fadeInUp}>
                <h3 className="text-2xl font-semibold mb-6">
                  Technology Stack
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {techStack.map((tech, index) => (
                    <MagicCard
                      key={index}
                      gradientColor={
                        resolvedTheme === "dark" ? "#262626" : "#D9D9D955"
                      }
                      layerClassName="bg-card"
                      className="rounded-lg hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="p-4 h-full">
                        <div className="flex items-center space-x-3">
                          <tech.icon className="h-8 w-8 text-primary" />
                          <div>
                            <h4 className="font-semibold">{tech.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {tech.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </MagicCard>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <h3 className="text-2xl font-semibold mb-6">Key Features</h3>
                <div className="space-y-4">
                  {keyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <feature.icon className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h4 className="font-semibold">{feature.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Community Showcase */}
      <section ref={communityRef} className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate={communityInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="max-w-6xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Powered by Community
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Meet the talented developers and educators shaping the future of
                education technology
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="mb-12">
              <h3 className="text-2xl font-semibold mb-6 text-center">
                Top Contributors
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                {contributors.map((contributor, index) => (
                  <MagicCard
                    key={index}
                    gradientColor={
                      resolvedTheme === "dark" ? "#262626" : "#D9D9D955"
                    }
                    layerClassName="bg-card"
                    className="rounded-lg text-center hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6 text-center">
                      <Avatar className="h-16 w-16 mx-auto mb-4">
                        <AvatarImage
                          src={contributor.avatar}
                          alt={contributor.name}
                        />
                        <AvatarFallback>
                          {contributor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <h4 className="font-semibold mb-1">{contributor.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        @{contributor.username}
                      </p>
                      <Badge variant="default_light">
                        {contributor.contributions} contributions
                      </Badge>
                    </CardContent>
                  </MagicCard>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Getting Started */}
      <section ref={gettingStartedRef} className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate={gettingStartedInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Get Started Today
              </h2>
              <p className="text-lg text-muted-foreground">
                Join thousands of educators and developers building the future
                of education
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div variants={fadeInUp}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Code2 className="mr-3 h-6 w-6" />
                      For Developers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                          1
                        </div>
                        <div>
                          <p className="font-medium">Clone the repository</p>
                          <code className="text-sm text-muted-foreground">
                            git clone https://github.com/{appConfig.githubUri}
                            .git
                          </code>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                          2
                        </div>
                        <div>
                          <p className="font-medium">Install dependencies</p>
                          <code className="text-sm text-muted-foreground">
                            npm install
                          </code>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                          3
                        </div>
                        <div>
                          <p className="font-medium">
                            Start development server
                          </p>
                          <code className="text-sm text-muted-foreground">
                            npm run dev
                          </code>
                        </div>
                      </div>
                    </div>
                    <ButtonLink
                      className="w-full mt-6"
                      href={appConfig.githubRepo}
                      variant="rainbow_outline"
                      target="_blank"
                    >
                      <Github />
                      View Repository
                    </ButtonLink>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="mr-3 h-6 w-6" />
                      For {orgConfig.shortName} members
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                          1
                        </div>
                        <p>
                          Sign up for a free account
                          <span className="text-muted-foreground">
                            {" "}
                            (use your {orgConfig.mailSuffix} email)
                          </span>
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                          2
                        </div>
                        <p>Set up your profile</p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                          3
                        </div>
                        <p>Explore the platform and join communities</p>
                      </div>
                    </div>
                    <div className="space-y-2 mt-6">
                      <ButtonLink
                        href={`/auth/sign-in?tab=sign-up&utm_source=${appConfig.appDomain}&utm_medium=redirect&utm_campaign=sign_up`}
                        className="w-full"
                      >
                        Get Started Free
                      </ButtonLink>
                      <ButtonLink
                        variant="outline"
                        className="w-full"
                        target="_blank"
                        href={content.wiki_url}
                      >
                        <ExternalLink />
                        View Documentation
                      </ButtonLink>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div
              variants={fadeInUp}
              className="mt-12 text-center"
              whileHover={scaleOnHover}
            >
              <Card className="p-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/50 shadow-lg">
                <h3 className="text-xl font-semibold mb-2">
                  Want to Contribute?
                </h3>
                <p className="text-muted-foreground mb-4">
                  We welcome contributions from developers, designers,
                  educators, and anyone passionate about improving education
                  technology.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <ButtonLink
                    variant="rainbow_outline"
                    effect="expandIcon"
                    href={content.contributing_url}
                    target="_blank"
                  >
                    <Github />
                    Contribution Guide
                    <ArrowUpRight className="icon" />
                  </ButtonLink>
                  <ButtonLink
                    variant="outline"
                    effect="expandIcon"
                    href={content.wiki_url}
                    target="_blank"
                  >
                    <BookOpen />
                    Wiki
                    <ArrowUpRight className="icon" />
                  </ButtonLink>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
