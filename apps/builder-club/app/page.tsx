import PerkCard from "@/components/PerkCard";
import TimelineCard from "@/components/TimelineCard";
import { Button } from "@/components/ui/button";
import { appConfig } from "@/project.config";
import { ArrowRight, ArrowUpRight, BrainCircuit, Calendar, Code, Network } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const timeline = [
    { week: 1, title: "Team + Idea", description: "Form teams and finalize project ideas" },
    { week: 2, title: "Build MVP", description: "Develop minimum viable products" },
    { week: 3, title: "Feedback", description: "Receive expert feedback and iterate" },
    { week: 4, title: "Demo Day", description: "Present projects to judges" }
  ];

  const perks = [
    { icon: <BrainCircuit size={24} />, title: "AI Tools", description: "ChatGPT Plus, Midjourney access" },
    { icon: <Code size={24} />, title: "Mentorship", description: "Guidance from industry experts" },
    { icon: <Calendar size={24} />, title: "Real Experience", description: "Build production-ready projects" },
    { icon: <Network size={24} />, title: "Network", description: "Connect with peer builders" }
  ];

  return (
   <div className="w-full mx-auto flex flex-col items-center space-y-16 pb-12">
  {/* Hero Section - More immersive */}
  <section className="relative w-full min-h-[90vh] max-w-screen-2xl mx-auto overflow-hidden">
    {/* Video Background with subtle zoom animation */}
    <video
      className="absolute inset-0 w-full h-full object-cover z-0 animate-zoom-in-slow"
      autoPlay
      loop
      muted
      playsInline
      src={appConfig.heroVideo}
    />

    {/* Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-black/20 z-10"></div>

    {/* Content with better vertical centering */}
    <div className="relative z-20 text-center text-white px-6 flex flex-col items-center justify-center min-h-[90vh] max-w-6xl mx-auto">
      <div className="space-y-6">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight tracking-tight">
          Welcome to <span className="text-primary">Build House</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
          Build fast. Learn fast. Launch real things.
        </p>
        
        <div className="pt-4">
          <Button asChild size="lg" className="group">
            <a href="/apply-now">
              Apply Now
              <ArrowRight className="ml-3 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  </section>

  {/* About Section - Cleaner layout */}
  <section className="w-full py-20 px-6 max-w-7xl mx-auto">
    <div className="grid md:grid-cols-2 gap-16 items-center">
      <div className="space-y-6">
        <h2 className="text-4xl font-bold">About Build House</h2>
        <div className="space-y-4 text-lg text-gray-700">
          <p>
            Build House is a 10-day intensive sprint where 15 selected students collaborate to build real-world projects.
          </p>
          <p>
            We provide the resources, mentorship, and environment to turn ideas into tangible products.
          </p>
          <p>
            Our mission is to create a launchpad for student builders to gain practical experience,
            develop their skills, and build a portfolio that stands out.
          </p>
        </div>
      </div>
      <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
        <Image 
          src="/team.png" 
          alt="Build House team" 
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  </section>

  {/* Timeline Section - More visual */}
  <section className="w-full py-20 px-6 max-w-7xl mx-auto">
    <div className="text-center space-y-16">
      <h2 className="text-4xl font-bold">Program Timeline</h2>
      <div className="grid md:grid-cols-4 gap-8">
        {timeline.map((item) => (
          <TimelineCard 
            key={item.week} 
            {...item} 
          />
        ))}
      </div>
    </div>
  </section>

  {/* Perks Section - Clean cards */}
  <section className="w-full py-20 px-6 max-w-7xl mx-auto">
    <div className="text-center space-y-16">
      <h2 className="text-4xl font-bold">What You Get</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {perks.map((perk, index) => (
          <PerkCard 
            key={index} 
            {...perk} 
          />
        ))}
      </div>
    </div>
  </section>

  {/* Final CTA - More emphasis */}
  <section className="w-full py-24 px-6 max-w-4xl mx-auto text-center bg-gradient-to-br from-gray-50 to-white rounded-3xl">
    <div className="space-y-8">
      <h2 className="text-4xl font-bold">Think you&apos;ve got what it takes?</h2>
      <Button asChild className="px-12">
        <a href="/apply-now">Apply Now</a>
      </Button>
      <p className="text-lg text-gray-600">
        Have questions?{' '}
        <a 
          href="https://www.linkedin.com/in/kanak-kholwal/" 
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-primary hover:underline"
        >
          Contact us <ArrowUpRight className="ml-1 w-4 h-4" />
        </a>
      </p>
    </div>
  </section>
</div>
  );
}