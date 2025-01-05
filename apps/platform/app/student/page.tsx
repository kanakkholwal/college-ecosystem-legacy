import { RouterCard } from "@/components/common/router-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RocketIcon } from "@radix-ui/react-icons";
import {
  AudioLines,
  Bot,
  CalendarDays,
  CalendarRange,
  Grid3X3
} from "lucide-react";
import Link from "next/link";
import { GrAnnounce } from "react-icons/gr";
import { LiaReadme } from "react-icons/lia";
import { MdOutlinePoll } from "react-icons/md";
import { SiGoogleclassroom } from "react-icons/si";
import { getSession } from "~/lib/auth-server";


export default async function StudentDashboard() {
  const session = await getSession();


  return (
    <div className="w-full mx-auto space-y-5">
      <section id="welcome-header">
        <h2 className="text-base md:text-lg font-semibold whitespace-nowrap">Hi, {session?.user?.name}</h2>
        <p className="text-slate-600 dark:text-slate-400">
          Welcome to the dashboard.
        </p>
      </section>
      <section id="main-section">

        <Alert className="mt-4">
          <RocketIcon className="h-4 w-4" />
          <AlertTitle>
            Suggest a feature for the platform here.(what do you want to see here?)
          </AlertTitle>
          <AlertDescription>
            <p>
              We are changing the way you interact with the platform and adding new features.
            </p>
            <Link
              href="https://forms.gle/v8Angn9VCbt9oVko7"
              target="_blank"
              rel="noopener noreferrer"
              className="underline mx-1"
            >
              Suggest a feature here
            </Link>{" "}
          </AlertDescription>
        </Alert>

      </section>

      <section id="quick_links" className="mb-32 grid  lg:mb-0 lg:w-full mx-auto @5xl:max-w-6xl grid-cols-1 @md:grid-cols-2 @4xl:grid-cols-4 text-left gap-4">
        {quick_links.map((link, i) => (
          <RouterCard
            key={link.href}
            {...link}
            style={{
              animationDelay: `${i * 500}ms`,
            }}
          />
        ))}
      </section>
    </div>
  );
}


const quick_links = [
  {
    href: "/results",
    title: "Results",
    description: "Check your results here.",
    Icon: Grid3X3,
  },
  {
    href: "/syllabus",
    title: "Syllabus",
    description: "Check your syllabus here.",
    Icon: LiaReadme,
  },
  {
    href: "/classroom-availability",
    title: "Classroom Availability",
    description: "Check the availability of classrooms here.",
    Icon: SiGoogleclassroom,
  },
  {
    href: "/schedules",
    title: "Schedules",
    description: "Check your schedules here.",
    Icon: CalendarDays,
    disabled: true,
  },
  {
    href: "/misc/calender",
    title: "Academic Calender",
    description: "Check the academic calender here.",
    Icon: CalendarRange,
    disabled: true,
  },
  {
    title: "Community",
    href: "/community",
    Icon: AudioLines,
    description: "Join the community and interact with your peers.",
  },
  {
    title: "Announcements",
    href: "/announcements",
    Icon: GrAnnounce,
    description: "Check out the latest announcements.",
  },
  {
    title: "Polls",
    href: "/polls",
    Icon: MdOutlinePoll,
    description: "Participate in polls.",
  },
  {
    href: "/chat",
    title: "Chatbot",
    description: "Chat with the college chatbot.(Beta)",
    Icon: Bot,
    disabled: true,
  },
];