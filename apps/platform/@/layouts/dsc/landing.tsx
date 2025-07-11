import { cn } from "@/lib/utils";
import { PropsType } from "../clubs";

import { BaseHeroSection } from "@/components/application/base-hero";
import GithubStars from "@/components/common/github";
import { SocialBar } from "@/components/common/navbar";
import {
    LinkNavLinksType,
    Navbar,
    NavBody,
    NavItems
} from "@/components/common/resizable-navbar";
import { ThemeSwitcher } from "@/components/common/theme-switcher";
import { Icon, IconType } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import { ButtonLink } from "@/components/utils/link";
import Image from "next/image";
import Link from "next/link";
import { appConfig } from "~/project.config";
import logo from "./assets/images/gdsc_logo.gif";
import { productSans } from "./constants";
import "./landing.css";

const nav_list: LinkNavLinksType[] = [
    {
        title: "About",
        href: "/about",
        type: "link",
    },
    {
        title: "Events",
        href: "/events",
        type: "link",
    },
    {
        title: "Resources",
        href: "/resources",
        type: "link",
    },
];
export default function ClubLandingPage(props: PropsType["landing"]) {
    if (!props.club.connectedSocials) {
        props.club.connectedSocials = {
            github: "https://github.com",
            linkedin: "https://linkedin.com",
            twitter: "https://twitter.com",
            instagram: "https://instagram.com",
            // website: "https://example.com",
        }
    }
    return (
        <div className={cn(productSans.className)}>
            <div className="w-full mt-6">
                <Navbar>
                    <NavBody className="flex w-full">
                        <Link
                            href="/" aria-label="Logo"
                            className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 rounded-2xl shrink-0"
                        >
                            <Image
                                height={40}
                                width={280}
                                className="h-10 w-auto"
                                src={logo}
                                alt="logo"
                                priority
                                loading="eager"
                            />
                        </Link>
                        <NavItems items={nav_list} />
                        <div className="flex items-center gap-4">
                            {props.club?.connectedSocials && Object.entries(props.club?.connectedSocials).map(([key, value]) => {
                                if (!value) return null; // Skip if no URL is provided
                                return (
                                    <ButtonLink key={key} variant="outline" size="icon_sm" href={value}>
                                        <Icon name={key as IconType} className="h-5 w-5" />
                                    </ButtonLink>
                                );
                            })}
                        </div>
                    </NavBody>


                </Navbar>

            </div>
            <BaseHeroSection
                title={props.club.name}
                titleClassName="text-3xl lg:text-5xl font-bold"
                description={props.club.tagline}
                descriptionClassName="text-lg"
                className="text-center hero min-h-96 max-w-full"
            />
            <section id="about" className="w-full mx-auto p-4 md:p-16 flex flex-col items-start md:flex-row gap-5">
                <div className="flex-1 shrink-0 w-full md:w-3/5 md:p-3">
                    <h2 className="text-4xl font-semibold mb-4 md:whitespace-nowrap">Who are we?</h2>
                </div>
                <div className="flex-auto w-full md:w-3/5 p-4 prose max-w-full dark:prose-invert">
                    <p >
                        Google Developer Student Clubs (<abbr>GDSC</abbr>) is a student-led community backed by Google Developers aimed at empowering undergraduate students from all disciplines to grow their knowledge in technology,
                        build solutions for their local communities, and connect with other members from the Google community.
                    </p>
                    <h3>Creating impact and empowering students through technology</h3>
                    <p>
                        Whether you are new to software development or you’ve been developing for quite a while, GDSC is a place where you can learn new technologies, make your ideas a reality, and collaborate to solve real-world problems. In addition to solving problems, GDSC will allow you to connect with other technology enthusiasts from other GDSC chapters and the Google Developer Community.
                    </p>
                    <h3>Creating impact and empowering students through technology</h3>
                    <p >
                        We will be hosting events and activities for all students throughout the academic year. We hope to see you there!
                    </p>
                </div>
            </section>
            <footer
                className={cn(
                    "z-40 w-full transition-all pt-5 pb-8 mt-auto",
                    "bg-card border-b"
                )}>
                <div className="w-full max-w-(--max-app-width) mx-auto px-3 sm:px-6 lg:px-8 flex flex-col justify-center">
                    <div className="mx-auto p-4">
                        <Link
                            href="/" aria-label="Logo"
                            className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 rounded-2xl shrink-0"
                        >
                            <Image
                                height={160}
                                width={540}
                                className="h-16 w-auto"
                                src={logo}
                                alt="logo"
                                loading="lazy"
                            />
                        </Link>

                    </div>
                    <Separator />
                    <div className="flex w-full flex-col lg:flex-row lg:justify-between gap-6 items-start p-4">
                        <div className="font-normal text-lg">
                            <p className="text-pretty text-sm text-muted-foreground">
                                {props.club.clubEmail ? "Email us at:" : "For inquiries, please contact us."}
                            </p>
                            {props.club.clubEmail && (
                                <a href={`mailto:${props.club.clubEmail}`} className="text-pretty text-primary hover:underline">
                                    {props.club.clubEmail}
                                </a>
                            )}
                        </div>
                    </div>
                    <div className="mt-8 flex flex-col justify-between gap-4 border-t py-8 md:flex-row md:items-center md:text-left">
                        <p className="order-2 lg:order-1 text-xs font-semibold text-muted-foreground">
                            Powered by
                            <Link href={appConfig.url} className="text-primary hover:underline mx-2">
                                {appConfig.name}
                            </Link>
                             © {new Date().getFullYear()}{" "}
                            All rights reserved.
                        </p>

                        <div className="flex flex-col md:flex-row items-center gap-4 order-1 md:order-2">
                            <SocialBar />
                            <GithubStars />
                        </div>
                        <ThemeSwitcher className="order-1 md:order-2" />
                    </div>
                </div>
            </footer>
        </div>
    );
}
