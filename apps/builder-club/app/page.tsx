import PerkCard from "@/components/PerkCard";
import TimelineCard from "@/components/TimelineCard";
import { Button } from "@/components/ui/button";
import { appConfig } from "@/project.config";
import { ArrowRight, ArrowUpRight, BrainCircuit, Calendar, Code, Network } from "lucide-react";

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
    <div className="w-full mx-auto flex flex-col items-center justify-start space-y-4 pb-8">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] w-full overflow-hidden shadow-xl max-w-screen-2xl mx-auto">
        {/* Video Background */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-10"
          autoPlay
          loop
          muted
          playsInline
          src={appConfig.heroVideo}
        />

        {/* Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black/70 to-black/30 z-20"></div>

        {/* Content */}
        <div className="relative z-30 text-center text-white px-5 py-20 md:py-28 lg:py-32 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[80vh]">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            Welcome to Build House
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-10 drop-shadow-sm">
            Build fast. Learn fast. Launch real things.
          </p>
          <Button size="lg" asChild>
            <a href="/apply-now">
              Apply Now
              <ArrowRight className="ml-2" />
            </a>
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">About Build House</h2>
            <p className="text-lg text-gray-700 mb-4">
              Build House is a 10-month intensive sprint where 15 selected students collaborate to build real-world projects.
              We provide the resources, mentorship, and environment to turn ideas into tangible products.
            </p>
            <p className="text-lg text-gray-700">
              Our mission is to create a launchpad for student builders to gain practical experience,
              develop their skills, and build a portfolio that stands out.
            </p>
          </div>
          <div className="bg-gray-100 rounded-xl h-80 shadow-2xl  flex items-center justify-center bg-no-repeat bg-cover"
            style={{ backgroundImage: "url('/team.png')" }}>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-16 text-center">Program Timeline</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {timeline.map((item) => (
            <TimelineCard key={item.week} {...item} />
          ))}
        </div>
      </section>

      {/* Perks Section */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-16 text-center">What You Get</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {perks.map((perk, index) => (
            <PerkCard key={index} {...perk} />
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Think you&apos;ve got what it takes?</h2>
        <Button size="lg" asChild>
          <a href="/apply-now">Apply Now</a>
        </Button>
        <p className="text-lg text-gray-600 mt-4">
          Contact us if you have any queries
          <Button variant="link" asChild>
            <a href="https://www.linkedin.com/in/kanak-kholwal/" target="_blank" className="text-blue-600 hover:underline">
              Contact Here.
              <ArrowUpRight />
            </a>
          </Button>
        </p>
      </section>

    </div>
  );
}