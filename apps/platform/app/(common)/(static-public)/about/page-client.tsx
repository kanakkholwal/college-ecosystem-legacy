"use client";

import { MagicCard } from "@/components/animation/magic-card";
import { StaggerChildrenContainer, StaggerChildrenItem } from "@/components/animation/motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  Github,
  Globe,
  Zap,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRef } from "react";
import { appConfig, orgConfig } from "~/project.config";



const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

interface AboutPageProps {
  contributors: { name: string; username: string; avatar: string; contributions: number }[];
  stats: { visitors: number; stars: number; forks: number; contributors: number };
}

export default function AboutPage({ contributors, stats }: AboutPageProps) {
  const { resolvedTheme } = useTheme();
  const heroRef = useRef(null);
  const techRef = useRef(null);
  const guideRef = useRef(null);
  const visionRef = useRef(null);
  const valuesRef = useRef(null);

  const heroIn = useInView(heroRef, { once: true });
  const techIn = useInView(techRef, { once: true });
  const guideIn = useInView(guideRef, { once: true });
  const visionIn = useInView(visionRef, { once: true });
  const valuesIn = useInView(valuesRef, { once: true });

  const techStack = [
    { name: "Next.js + Express.js", icon: Globe, desc: "Modern and reliable web framework." },
    { name: "TypeScript", icon: Code2, desc: "Type-safe development for fewer bugs." },
    { name: "Tailwind CSS", icon: Cpu, desc: "Utility-first design system for responsive styling." },
    { name: "Postgres + MongoDB", icon: Database, desc: "Combining relational and NoSQL storage." },
  ];

  const features = [
    { name: "Blazing Fast", icon: Zap, desc: "Optimized with SSR, caching, and scalable APIs." },
    { name: "Scalable", icon: Code2, desc: "Built to handle real-world student and faculty loads." },
    { name: "Open Source", icon: Github, desc: "Transparent and open for contributions." },
  ];

  return (
    <>
      {/* Hero */}
      <section
        ref={heroRef}
        className="py-24 lg:py-32"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            animate={heroIn ? "visible" : "hidden"}
            variants={stagger}
            className="max-w-3xl mx-auto"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-4xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-500"
            >
              {content.headline}
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-muted-foreground mb-8 leading-relaxed"
            >
              {content.description.trim()}
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <ButtonLink
                href={appConfig.githubRepo}
                variant="rainbow"
                size="lg"
                target="_blank"
              >
                <Github /> View on GitHub <ChevronRight className="icon" />
              </ButtonLink>
              <ButtonLink
                href={content.wiki_url}
                variant="outline"
                size="lg"
                target="_blank"
              >
                <BookOpen /> Documentation <ChevronRight className="icon" />
              </ButtonLink>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Vision */}
      <section ref={visionRef} className="py-16 lg:py-24">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <motion.div
            initial="hidden"
            animate={visionIn ? "visible" : "hidden"}
            variants={stagger}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl lg:text-4xl font-bold mb-4"
            >
              Our Vision
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-muted-foreground mb-6 leading-relaxed"
            >
              The College Ecosystem project is designed to simplify campus life
              for students, educators, and administrators. From accessing
              academic results to managing hostel allotments and participating in
              clubs, our platform integrates everything into one unified system.
            </motion.p>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-muted-foreground leading-relaxed"
            >
              We believe education technology should feel personal, intuitive,
              and efficient. By building with open-source principles, we ensure
              every improvement benefits the entire community.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section ref={valuesRef} className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial="hidden"
            animate={valuesIn ? "visible" : "hidden"}
            variants={stagger}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl lg:text-4xl font-bold text-center mb-8"
            >
              What We Stand For
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <motion.div variants={fadeInUp}>
                <h3 className="text-xl font-semibold mb-3">Accessibility</h3>
                <p className="text-muted-foreground">
                  Tools and resources should be available to every student,
                  regardless of background or device.
                </p>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <h3 className="text-xl font-semibold mb-3">Community</h3>
                <p className="text-muted-foreground">
                  We grow together by encouraging collaboration between students,
                  teachers, and developers worldwide.
                </p>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <h3 className="text-xl font-semibold mb-3">Transparency</h3>
                <p className="text-muted-foreground">
                  Open-source code means nothing is hidden. Everyone is welcome
                  to audit, suggest, and improve.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tech Overview */}
      <section ref={techRef} className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate={techIn ? "visible" : "hidden"}
            variants={stagger}
            className="max-w-5xl mx-auto"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl lg:text-4xl font-bold text-center mb-4"
            >
              Technology at the Core
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-muted-foreground mb-12 text-center"
            >
              Built with industry-grade tools, ensuring speed, reliability, and
              scalability.
            </motion.p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div variants={fadeInUp}>
                <h3 className="text-2xl font-semibold mb-6">Tech Stack</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {techStack.map((t, i) => (
                    <MagicCard
                      key={i}
                      gradientColor={resolvedTheme === "dark" ? "#222" : "#ddd"}
                      layerClassName="bg-card"
                      className="rounded-lg p-4 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center space-x-3">
                        <t.icon className="h-6 w-6 text-primary" />
                        <div>
                          <h4 className="font-semibold">{t.name}</h4>
                          <p className="text-sm text-muted-foreground">{t.desc}</p>
                        </div>
                      </div>
                    </MagicCard>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <h3 className="text-2xl font-semibold mb-6">Key Features</h3>
                <div className="space-y-4">
                  {features.map((f, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <f.icon className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h4 className="font-semibold">{f.name}</h4>
                        <p className="text-sm text-muted-foreground">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Get Started */}
      <section ref={guideRef} className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate={guideIn ? "visible" : "hidden"}
            variants={stagger}
            className="max-w-5xl mx-auto text-center"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl lg:text-4xl font-bold mb-4"
            >
              Get Started Today
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-muted-foreground mb-12"
            >
              Whether you’re a developer looking to contribute or a student eager
              to explore features, starting is simple.
            </motion.p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Developer Card */}
              <motion.div variants={fadeInUp}>
                <Card className="rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Code2 className="h-6 w-6" /> Developers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-muted-foreground text-sm">
                      Get the project running locally and start contributing.
                    </p>
                    <ol className="list-decimal list-inside space-y-3 mb-4 text-sm">
                      <li>
                        Clone the repo:{" "}
                        <code className="text-xs text-muted-foreground">
                          git clone https://github.com/{appConfig.githubUri}.git
                        </code>
                      </li>
                      <li>
                        Install deps:{" "}
                        <code className="text-xs text-muted-foreground">
                          npm install
                        </code>
                      </li>
                      <li>
                        Run dev server:{" "}
                        <code className="text-xs text-muted-foreground">
                          npm run dev
                        </code>
                      </li>
                    </ol>
                    <ButtonLink
                      href={appConfig.githubRepo}
                      variant="rainbow_outline"
                      target="_blank"
                    >
                      <Github /> View Repository
                    </ButtonLink>
                  </CardContent>
                </Card>
              </motion.div>

              {/* NITH Students Card */}
              <motion.div variants={fadeInUp}>
                <Card className="rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="h-6 w-6" /> For NITH Students
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-muted-foreground text-sm">
                      Access academic results, manage your hostel allocation,
                      explore clubs, and more—all in one place.
                    </p>
                    <ol className="list-decimal list-inside space-y-3 mb-4 text-sm">
                      <li>
                        Sign up with your NITH email (ends with {orgConfig.mailSuffix})
                      </li>
                      <li>Set up your profile</li>
                      <li>
                        Explore features like results, hostels, and student clubs
                      </li>
                    </ol>
                    <div className="flex flex-col gap-3">
                      <ButtonLink
                        href={`/auth/sign-in?tab=sign-up`}
                        className="w-full"
                      >
                        Get Started Free
                      </ButtonLink>
                      <ButtonLink
                        href={content.wiki_url}
                        variant="outline"
                        target="_blank"
                      >
                        <ExternalLink /> View Documentation
                      </ButtonLink>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            <FAQSection />
            <StaggerChildrenContainer className="mt-12">
              <StaggerChildrenItem className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-semibold mb-2">Want to Contribute?</h3>
                <p className="mb-4 text-muted-foreground">
                  Contributions are open to all. Whether you fix bugs, improve
                  documentation, or design new features, your input matters.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <ButtonLink
                    href={content.contributing_url}
                    variant="rainbow_outline"
                    target="_blank"
                  >
                    <Github /> Contribution Guide <ArrowUpRight className="icon" />
                  </ButtonLink>
                  <ButtonLink
                    href={content.wiki_url}
                    variant="outline"
                    target="_blank"
                  >
                    <BookOpen /> Wiki <ArrowUpRight className="icon" />
                  </ButtonLink>
                </div>
              </StaggerChildrenItem>
            </StaggerChildrenContainer>
            
          </motion.div>
        </div>
      </section>
    </>
  );
}


export function FAQSection() {
  return (
    <StaggerChildrenContainer className="w-full py-16">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-3xl font-bold text-foreground text-center mb-10">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="space-y-4 text-left">
          <AccordionItem value="item-1" className="rounded-2xl border bg-card shadow-sm">
            <AccordionTrigger className="px-4 py-3 text-lg font-medium text-foreground">
              What is the College Ecosystem project about?
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-muted-foreground">
              The College Ecosystem is an open-source initiative to create tools, platforms, and resources that simplify academic and campus life. It focuses on accessibility, scalability, and community-driven development.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="rounded-2xl border bg-card shadow-sm">
            <AccordionTrigger className="px-4 py-3 text-lg font-medium text-foreground">
              Who can contribute to this project?
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-muted-foreground">
              Anyone can contribute—students, developers, designers, and educators. Whether you want to fix bugs, build features, or improve documentation, there’s a place for you in the community.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="rounded-2xl border bg-card shadow-sm">
            <AccordionTrigger className="px-4 py-3 text-lg font-medium text-foreground">
              How can I get started?
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-muted-foreground">
              Start by visiting our GitHub repository. You can follow the setup guide, look for issues labeled “good first issue,” and join discussions on features and improvements.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="rounded-2xl border bg-card shadow-sm">
            <AccordionTrigger className="px-4 py-3 text-lg font-medium text-foreground">
              Is this platform free to use?
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-muted-foreground">
              Yes, the platform is open-source and free to use. The goal is to make education technology accessible to everyone without paywalls or restrictions.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="rounded-2xl border bg-card shadow-sm">
            <AccordionTrigger className="px-4 py-3 text-lg font-medium text-foreground">
              Where can I find documentation?
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-muted-foreground">
              You can explore detailed documentation on our wiki and official docs site. These resources include setup guides, API references, and contribution guidelines.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </StaggerChildrenContainer>
  );
}

export const content = {
  headline: "Empowering Education Through Open Source",
  description:
    "We're building the future of educational technology with a community-driven platform that makes learning accessible, engaging, and effective for students and educators worldwide. The College Ecosystem project integrates results, hostels, clubs, and academic tools into one seamless digital platform.",
  wiki_url:
    "https://github.com/kanakkholwal/college-ecosystem/wiki/Introduction",
  contributing_url:
    "https://github.com/kanakkholwal/college-ecosystem/blob/main/CONTRIBUTING.md",
  visitors: 40400,
};
