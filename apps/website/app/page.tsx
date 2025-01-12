import Footer from "app/layouts/footer";
import Navbar from "app/layouts/navbar";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    name: "Check Results",
    description: "Instantly access your academic results with a quick search.",
    icon: "/assets/results.png",
    href: "https://app.nith.eu.org/results?utm_source=nith.eu.org",
  },
  {
    name: "Syllabus & Study Material",
    description: "Find all your course materials in one place.",
    icon: "/assets/syllabus.png",
    href: "https://app.nith.eu.org/syllabus?utm_source=nith.eu.org",
  },
  {
    name: "Attendance Manager",
    description: "Keep track of your attendance effortlessly",
    icon: "/assets/attendance.png",
    href: "https://app.nith.eu.org/attendance?utm_source=nith.eu.org",
  },
  {
    name: "Classroom Availability",
    description: "Check the availability of classrooms in real-time.",
    icon: "/assets/classroom.png",
    href: "https://app.nith.eu.org/classroom-availablity?utm_source=nith.eu.org",
  },
  {
    name: "Announcements & Polls",
    description: `Stay updated with the latest news and participate in polls.`,
    icon: "/assets/polls.png",
    href: "https://app.nith.eu.org/polls?utm_source=nith.eu.org",
  },
  {
    name: "Community Groups",
    description: ` Connect with peers through community groups like subreddits`,
    icon: "/assets/community.png",
    href: "https://app.nith.eu.org/community?utm_source=nith.eu.org",
  },
];

export default function HomePage() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="space-y-40 mb-40">
        <div className="relative" id="home">
          <div
            aria-hidden="true"
            className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20"
          >
            <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700" />
            <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600" />
          </div>
          <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-6">
            <div className="relative pt-36 ml-auto">
              <div className="lg:w-3/4 text-center mx-auto">
                <h1 className="text-gray-900 dark:text-white font-bold text-5xl md:text-6xl xl:text-7xl">
                  Empower Your College Experience
                </h1>
                <p className="mt-8 text-gray-700 dark:text-gray-300 text-center mx-auto">
                  All-in-One Student Hub: Results, Resources, Attendance & More
                </p>
                <div className="mt-16 flex flex-wrap justify-center gap-y-4 gap-x-6">
                  <Link
                    href="https://app.nith.eu.org?utm_source=nith.eu.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
                  >
                    <span className="relative text-base font-semibold text-white">
                      Get Started Now
                    </span>
                  </Link>
                  <Link
                    href="#solutions"
                    className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:border before:border-transparent before:bg-primary/10 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 dark:before:border-gray-700 dark:before:bg-gray-800 sm:w-max"
                  >
                    <span className="relative text-base font-semibold text-primary dark:text-white">
                      Learn more
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="solutions">
          <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-6">
            <div className="md:w-2/3 lg:w-1/2">
              <h2 className="my-8 text-2xl font-bold text-gray-700 dark:text-white md:text-4xl">
                Your College, Your Way
              </h2>
            </div>
            <div className="mt-16 grid divide-x divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden rounded-3xl border border-gray-100 text-gray-600 dark:border-gray-700 sm:grid-cols-2 lg:grid-cols-4 lg:divide-y-0 xl:grid-cols-4">
              {features.map((feature, index) => {
                return (
                  <div
                    key={index}
                    className="group relative bg-white dark:bg-gray-800 dark:hover:bg-gray-700 transition hover:z-[1] hover:shadow-2xl hover:shadow-slate-600/10 hover:bg-slate-100 "
                  >
                    <div className="relative space-y-8 py-12 p-8 flex flex-col justify-between">
                      <Image
                        src={feature.icon}
                        className="w-12"
                        width={512}
                        height={512}
                        alt={feature.name}
                      />
                      <div className="space-y-2">
                        <h5 className="text-xl font-semibold text-gray-700 dark:text-white transition group-hover:text-primary/80">
                          {feature.name}
                        </h5>
                        <p className="text-gray-600 dark:text-gray-300">
                          {feature.description}
                        </p>
                      </div>
                      <Link
                        href={feature.href}
                        className="flex items-center justify-between group-hover:text-primary"
                      >
                        <span className="text-sm font-semibold">Read more</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5 -translate-x-4 text-2xl opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
