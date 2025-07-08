"use client";
import { MagicCard } from '@/components/animation/magic-card';
import { ThemeSwitcher } from '@/components/common/theme-switcher';
import { ApplicationInfo } from '@/components/logo';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Link1Icon } from '@radix-ui/react-icons';
import {
  Activity,
  ArrowUpRight,
  BarChart2,
  BookOpen,
  Calendar,
  Code,
  Cpu,
  Globe,
  LayoutTemplate,
  Mail,
  Phone,
  ShieldCheck,
  Terminal,
  Users
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { ClubTypeJson } from '~/models/clubs';
import { appConfig } from '~/project.config';
import { Icon, IconType } from '../icons';
import { ButtonLink } from '../utils/link';


export interface ClubLandingClientProps {
  clubData: ClubTypeJson & {
    stats: {
      events: number;
      projects: number;
      members: number;
    };
    upcomingEvents: {
      id: number;
      name: string;
      date: string;
      type: string;
    }[];
  };
}

export default function ClubLandingClient({ clubData }: ClubLandingClientProps) {
  const { theme } = useTheme();
  const darkMode = theme === 'dark';
  // Theme with dark mode adjustments
  const themeScheme = clubData.theme || {
    primaryColor: "#1e293b",
    secondaryColor: "#38bdf8",
    territoryColor: "#f43f5e",
    backgroundColor: "#ffffff",
    textColor: "#0f172a"
  };

  // Dark mode adjusted colors
  const darkModeAdjust = (color: string, darken: boolean = true) => {
    if (!darkMode) return color;

    // Simple adjustment for dark mode - you can replace with a proper color manipulation library
    if (darken) {
      if (color === themeScheme.backgroundColor) return "#0f172a";
      if (color === themeScheme.textColor) return "#f8fafc";
    }
    return color;
  };

  const styles = {
    '--primary': darkModeAdjust(themeScheme.primaryColor),
    '--primary-light': darkModeAdjust(themeScheme.primaryColor, false),
    '--secondary': darkModeAdjust(themeScheme.secondaryColor),
    '--territory': darkModeAdjust(themeScheme.territoryColor || ""),
    '--bg': darkModeAdjust(themeScheme?.backgroundColor || "#ffffff"),
    '--text': darkModeAdjust(themeScheme?.textColor || "#0f172a"),
    '--text-inverse': darkMode ? darkModeAdjust(themeScheme?.backgroundColor || "#ffffff") : darkModeAdjust(themeScheme?.textColor || "#0f172a"),
  } as React.CSSProperties;


  return (
    <div
      className={cn(`relative min-h-screen transition-colors duration-300 selection:text-white selection:bg-primary/50`, {
        'dark bg-gray-900': darkMode,
        'bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe]': !darkMode,
        
      },
      "not-[>#pattern]:z-10"
    )}
      style={styles}
    >
      <div className="absolute inset-0 opacity-10 z-0" id='pattern'>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8cGF0aCBkPSJNIDIwIDAgTCAwIDAgMCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPgo8L3N2Zz4=')]"></div>
      </div>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card backdrop-blur-sm border-b ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Link
                  href={appConfig.url + "?utm_source=club_landing_page&utm_medium=referral&utm_campaign=club_landing&utm_content=" + clubData.subDomain}

                >
                  <ApplicationInfo />
                </Link>
              </div>
              <div className="hidden md:block ml-10">
                <div className="flex space-x-6">
                  {['Overview', 'Events', 'Projects', 'Members', 'Resources'].map((item) => (
                    <a
                      key={item}
                      className={cn('px-3 py-2 rounded-md text-sm font-medium transition-colors', {
                        // 'text-white dark:text-[--text]': activeTab === item.toLowerCase(),
                        // 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white': activeTab !== item.toLowerCase(),
                      })}

                      href={`#${item.toLowerCase()}`}
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 ml-auto">
              <ThemeSwitcher />
              <ButtonLink
                href={appConfig.url + "?utm_source=club_landing_page&utm_medium=referral&utm_campaign=club_landing&utm_content=" + clubData.subDomain}
                variant="rainbow"
                rounded="full"
                size="sm"
              >
                Go to Platform <ArrowUpRight />
              </ButtonLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div id="hero" className="w-full flex relative flex-col items-center h-full min-h-96 py-14 px-20 text-foreground bg-accent"
      >
        <div className="absolute -top-[4rem] -left-[3.3rem] hidden sm:block rotate-[90deg]">
          <div className="border-[8px] border-primary rounded-t-full border-b-0 w-[13rem] h-[6.6rem] opacity-20 lg:opacity-50" />
        </div>
        <div className="absolute bottom-[1rem] hidden sm:block right-[0.3rem] -rotate-[32deg]">
          <div className="border-[8px] border-primary rounded-t-full border-b-0 w-[13rem] h-[6.6rem] opacity-20 lg:opacity-60" />
        </div>

        <div className="max-w-7xl mx-auto gap-3 flex flex-col w-fit h-full items-start justify-center z-10 sm:text-center lg:text-left">
          <Link className="text-xs text-muted-foreground hover:text-foreground  flex gap-1 items-center" target="_blank"
            href={"https://webstudio.is"}>
            Get to know us more
            <Link1Icon className='inline-block size-3' />

          </Link>

          <div className="text-4xl 3xl:text-5xl font-semibold">
            <h1 className="text-4xl 3xl:text-5xl w-full font-semibold text-(--primary) dark:text-(--secondary)">
              {clubData.name}
            </h1>
            <h2 className="text-xl 3xl:text-2xl w-full font-medium  text-(--secondary) dark:text-(--territory)">
              {clubData.tagline}
            </h2>
          </div>
          <p className="text-xl mb-8 text-foreground opacity-80 text-pretty max-w-4xl">
            {clubData.description}
          </p>
          <div className="flex justify-start gap-2">
            <Button
              size="lg"
              variant="rainbow_outline"
            >
              Join Now
            </Button>
            <Button
              variant="dark"
              size="lg"
            >
              View Events
            </Button>
          </div>
        </div>
        <div className="h-56 w-full bg-card rounded-bl-xl sm:h-72 md:h-96 lg:w-full lg:h-full" >
        </div>
      </div>


      {/* Stats Section */}
      <div className="py-12 bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base font-semibold tracking-wide uppercase text-(--secondary) dark:text-(--territory)">
              Community
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight  text-(--primary) dark:text-(--secondary)">
              Our Growing Community
            </p>
            <p className="mt-4 max-w-2xl text-xl lg:mx-auto text-muted-foreground">
              Join our vibrant community of developers, designers, and innovators.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="transition-all hover:shadow-lg hover:scale-[1.02] ">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-medium ">
                    Members
                  </CardTitle>
                  <Users className="size-6 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-(--primary)">
                    {clubData.stats.members}+
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    Active members in our community
                  </p>
                </CardContent>
              </Card>

              <Card className="transition-all hover:shadow-lg hover:scale-[1.02] dark:bg-gray-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-medium text-(--primary) dark:text-(--text)">
                    Events
                  </CardTitle>
                  <Calendar className="size-6 text-(--secondary)" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-(--primary) dark:text-(--text)">
                    {clubData.stats.events}
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    Events organized this year
                  </p>
                </CardContent>
              </Card>

              <Card className="transition-all hover:shadow-lg hover:scale-[1.02] dark:bg-gray-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-medium text-(--primary) dark:text-(--text)">
                    Projects
                  </CardTitle>
                  <Code className="size-6 text-(--secondary)" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-(--primary) dark:text-(--text)">
                    {clubData.stats.projects}
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    Projects developed by members
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Focus Areas */}
      <div
        className="py-12"
        style={{ backgroundColor: `var(--primary)`, color: 'white' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold tracking-wide uppercase opacity-80">
              What We Do
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight sm:text-4xl">
              Our Focus Areas
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: <Terminal className="h-10 w-10" />, title: "Competitive Programming", desc: "Regular contests and training sessions" },
                { icon: <Cpu className="h-10 w-10" />, title: "AI/ML Research", desc: "Cutting-edge research in artificial intelligence" },
                { icon: <LayoutTemplate className="h-10 w-10" />, title: "Web Development", desc: "Modern web technologies and frameworks" },
                { icon: <BookOpen className="h-10 w-10" />, title: "Learning Resources", desc: "Curated resources and study materials" },
                { icon: <BarChart2 className="h-10 w-10" />, title: "Data Science", desc: "Working with data to solve real problems" },
                { icon: <Activity className="h-10 w-10" />, title: "Hackathons", desc: "Regular hackathons and coding challenges" },
              ].map((item, index) => (
                <MagicCard
                  key={index}
                  layerClassName=''
                  className="p-6 rounded-lg backdrop-blur-sm transition-all bg-gradient-to-br from-(--primary) to-(--secondary) dark:from-(--primary-light) dark:to-(--secondary)"
                >
                  <div className="mb-4 text-(--secondary)">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </MagicCard>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Club Info Card */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-base font-semibold tracking-wide uppercase text-(--secondary)">
              Club Information
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-(--primary) dark:text-(--text)">
              About CodeStorm
            </p>
          </div>

          <div className="bg-card rounded-2xl shadow-xl overflow-hidden max-w-4xl mx-auto">
            <div className="md:flex">
              <div className="md:flex-shrink-0">
                <div className="h-48 w-full bg-gray-200 dark:bg-gray-600 border-2 border-dashed rounded-xl md:h-full md:w-48" />
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <h1 className="text-2xl font-bold text-(--primary) dark:text-(--text)">
                      {clubData.name}
                    </h1>
                    {clubData.isVerified && (
                      <ShieldCheck className="ml-2 h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  <Badge variant="outline" className="border-(--primary) text-(--primary) dark:border-(--secondary) dark:text-(--secondary)">
                    {clubData.category} Club
                  </Badge>
                </div>

                <p className="mt-2 italic text-(--secondary)">
                  {clubData.tagline}
                </p>

                <p className="mt-4 text-muted-foreground">
                  {clubData.description}
                </p>

                <div className="mt-6">
                  <div className="flex flex-wrap gap-2">
                    {clubData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        className="bg-(--secondary) text-white hover:bg-(--secondary)/90"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-(--primary) dark:text-(--text)">CONTACT</h3>
                    <div className="mt-2 flex items-center text-muted-foreground">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{clubData.clubEmail}</span>
                      {clubData.isClubEmailVerified && (
                        <ShieldCheck className="ml-2 h-3 w-3 text-green-500" />
                      )}
                    </div>
                    <div className="mt-1 flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-300" />
                      <a
                        href={clubData.customDomain}
                        className="hover:underline text-(--secondary)"
                      >
                        {clubData.customDomain?.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-(--primary) dark:text-(--text)">PRESIDENT</h3>
                    <div className="mt-2 flex items-center text-muted-foreground">
                      <Avatar className="size-6 mr-2">
                        <AvatarFallback>{clubData.president.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{clubData.president.name}</span>
                    </div>
                    <div className="mt-1 flex items-center text-muted-foreground">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{clubData.president.email}</span>
                    </div>
                    {clubData.president.phoneNumber && (
                      <div className="mt-1 flex items-center text-muted-foreground">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{clubData.president.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex space-x-4">
                  <Button
                    variant="outline"
                    className="flex items-center border-(--primary) text-(--primary) hover:bg-(--primary)/10 dark:hover:bg-(--primary)/20"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Contact President
                  </Button>
                  <Button className="bg-(--territory) hover:bg-(--territory)/90">
                    Join Club
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className={`py-12 ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold tracking-wide uppercase text-(--secondary)">
              Events
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-(--primary) dark:text-(--text)">
              Upcoming Events
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {clubData.upcomingEvents.map((event) => (
              <Card
                key={event.id}
                className="transition-all hover:shadow-lg dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-(--primary) dark:text-(--text)">{event.name}</CardTitle>
                    <Badge
                      variant="outline"
                      className="capitalize border-(--territory) text-(--territory)"
                    >
                      {event.type}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(event.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Join us for our upcoming {event.type.toLowerCase()} where you can showcase your skills and learn from others.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-(--primary) text-(--primary) hover:bg-(--primary)/10 dark:hover:bg-(--primary)/20"
                  >
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              variant="outline"
              className="px-8 py-3 font-medium border-(--primary) text-(--primary) hover:bg-(--primary)/10 dark:hover:bg-(--primary)/20"
            >
              View All Events
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-b">
        <div className="w-full max-w-(--max-app-width) mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold">{clubData.name}</h3>
              <p className="mt-2 text-muted-foreground">
                {clubData.tagline}
              </p>
              <div className="mt-4 flex justify-start space-x-4">
                {(['twitter', 'github', 'linkedin', 'instagram'] as IconType[]).map((platform) => {
                  return (
                    <a
                      key={platform}
                      href={`#`} // Replace with actual links
                      target="_blank"
                      className={cn(
                        "inline-flex items-center justify-center rounded-md text-sm font-medium disabled:pointer-events-none disabled:opacity-50 p-1.5 [&_svg]:size-5 size-8 icon text-muted-foreground md:[&_svg]:size-4.5",
                        "hover:bg-muted hover:text-primary hover:-translate-y-1 ease-in transition-all duration-300 flex justify-center items-center"
                      )}
                    >
                      <Icon name={platform} className="size-6 icon" />
                    </a>
                  );
                })}

              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider">Quick Links</h4>
              <ul className="mt-4 space-y-2">
                {['About', 'Events', 'Projects', 'Members', 'Resources'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-muted-foreground hover:text-primary">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider">Resources</h4>
              <ul className="mt-4 space-y-2">
                {['Learning Materials', 'Code Repository', 'Project Templates', 'Blog', 'FAQs'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-muted-foreground hover:text-primary">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider">Contact</h4>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start">
                  <Mail className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                  <span>{clubData.clubEmail}</span>
                </li>
                <li className="flex items-start">
                  <Globe className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                  <a href={clubData.customDomain} className="hover:underline">
                    {clubData.customDomain?.replace(/^https?:\/\//, '')}
                  </a>
                </li>
                <li className="flex items-start">
                  <Users className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                  <span>{clubData.president.name} (President)</span>
                </li>
              </ul>
            </div>
          </div>


        </div>
        <div className="w-full max-w-(--max-app-width) mx-auto mt-8 flex flex-col justify-between gap-4 border-t py-8 text-xs font-medium text-muted-foreground md:flex-row md:items-center md:text-left">
          <p className="order-2 lg:order-1">
            {clubData.name} {" "}
            © {new Date().getFullYear()} {appConfig.name}. All rights reserved.</p>


          <ThemeSwitcher className="order-1 md:order-2" />
        </div>
      </footer>
    </div>
  );
}