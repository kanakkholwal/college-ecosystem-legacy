import { cn } from "@/lib/utils";
import { PropsType } from "../clubs";

import { BaseHeroSection } from "@/components/application/base-hero";
import GithubStars from "@/components/common/github";
import { SocialBar } from "@/components/common/navbar";
import {
    Navbar,
    NavBody,
    NavItems
} from "@/components/common/resizable-navbar";
import { ThemeSwitcher } from "@/components/common/theme-switcher";
import { Icon, IconType } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import { ButtonLink } from "@/components/utils/link";
import activitiesImage from "./assets/images/activities.png";

import Image from "next/image";
import Link from "next/link";
import { appConfig } from "~/project.config";

import { CardCarousel } from "@/components/animation/card-carousel";
import { FloatingElements } from "@/components/animation/floating-elements";
import { InView } from "@/components/animation/in-view";
import { InfiniteSlider } from "@/components/animation/infinite-slider";
import { NumberTicker } from "@/components/animation/number-ticker";
import heroImage from "./assets/images/hero-project.jpg";
import { allTeamMembers } from "./constants";

const variants = {
    hidden: { opacity: 0, y: 100, filter: 'blur(4px)' },
    visible: {
        opacity: 1, y: 0, filter: 'blur(0px)',
        transition: {
            staggerChildren: 0.09,
        },
    },
}
// const viewOptions = { margin: '0px 0px -200px 0px' };
// const transition = { duration: 0.3, ease: 'easeInOut' };


export default function ClubTeamPage(props: PropsType["projects"]) {
    const { navLinks, clubLogo, logos, } = props.clubSettings;

    return (<>
        <div className="w-full mt-6">
            <Navbar>
                <NavBody className="flex w-full">
                    <Link href="." aria-label="Logo"
                        className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 rounded-2xl shrink-0">
                        <Image
                            height={40}
                            width={280}
                            className="h-10 w-auto"
                            src={clubLogo}
                            alt="logo"
                            loading="eager"
                            priority
                            unoptimized
                        />
                    </Link>
                    <NavItems items={navLinks} />
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
            title="Projects - Google Developer Student Clubs"
            description="Explore the innovative projects developed by our club members, showcasing their skills and creativity in technology."
            titleClassName="text-3xl lg:text-5xl font-bold from-(--primary) via-50% via-(--secondary) to-(--quaternary) bg-gradient-to-r"
            descriptionClassName="text-lg"
            className="text-center hero min-h-96 max-w-full"
            style={{
                '--bg-image': `url(${heroImage.src})`,
                backgroundAttachment: "scroll",
                backgroundPosition: "center",
                backgroundSize: "cover",
            } as React.CSSProperties}
        >
            <FloatingElements/>

        </BaseHeroSection>
        <section id="about" className="relative w-full max-w-7xl mx-auto p-4 md:p-16">

            <InView

                variants={variants}
                viewOptions={{ margin: '0px 0px -200px 0px' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}

                className="flex-auto w-full p-4 prose max-w-full dark:prose-invert">

                <h2 className="text-4xl font-semibold mb-4 md:whitespace-nowrap">
                    About Community Projects
                    <Separator className="my-2 bg-(--quaternary) h-0.5 rounded-full max-w-[200px]" />
                </h2>
                <p>
                    Community Projects is a semester-long program where students create software-based solutions for a problem in their community.
                    By being a part of a community project, you’ll gain industry-standard knowledge and experience of must-have skills such as
                    Python, Java, Go lang, Javascript, Typescript, web development, backend/frontend development, databases, and much more!

                </p>

            </InView>
        </section>
        <InView
            as="section"
            variants={variants}
            viewOptions={{ margin: '0px 0px -200px 0px' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            id="what-we-do" className="w-full mx-auto p-4 md:p-16 flex flex-col items-start md:grid md:grid-cols-12 gap-5">
            <InView

                variants={{
                    hidden: { opacity: 0, y: 100, filter: 'blur(4px)' },
                    visible: {
                        opacity: 1, y: 0, filter: 'blur(0px)',
                        transition: {
                            staggerChildren: 0.09,
                        },
                    },
                }}
                viewOptions={{ margin: '0px 0px -200px 0px' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}

                className="flex-auto w-full md:col-span-7 p-4 prose max-w-full dark:prose-invert">
                <h2 className="text-4xl font-semibold mb-4 md:whitespace-nowrap">What we do</h2>
                <Separator className="my-2 bg-(--secondary) h-0.5 rounded-full max-w-[200px]" />
                <p className="text-lg mt-5">
                    We conducted workshops, seminars and other fun activities which help the students develop new skills and grow together as community to solve real world problems.

                </p>
                <h3>Creating impact and empowering students through technology</h3>
                <p >
                    We will be hosting events and activities for all students throughout the academic year. We hope to see you there!
                </p>
                <div className="bg-card p-4 pl-6 md:pl-4 rounded-lg mt-6 grid grid-cols-1 md:grid-cols-4 md:place-items-center gap-4">
                    <div>
                        <NumberTicker
                            className="text-5xl font-semibold text-(--primary)"
                            value={props.club.members.length || 56} suffix="+" />
                        <p className="text-base text-muted-foreground mt-0">
                            Members and counting!
                        </p>
                    </div>
                    <div>
                        <NumberTicker
                            className="text-5xl font-semibold text-(--secondary)"
                            value={props.club.members.length || 33} suffix="+" />
                        <p className="text-base text-muted-foreground mt-0">
                            Events organized
                        </p>
                    </div>
                    <div>
                        <NumberTicker
                            className="text-5xl font-semibold text-(--tertiary)"
                            value={props.club.members.length || 77} suffix="+" />
                        <p className="text-base text-muted-foreground mt-0">
                            Projects built
                        </p>
                    </div>
                    <div>
                        <NumberTicker
                            className="text-5xl font-semibold text-(--quaternary)"
                            value={props.club.members.length || 25} suffix="+" />
                        <p className="text-base text-muted-foreground mt-0">
                            Workshops conducted
                        </p>
                    </div>
                </div>
            </InView>
            <div className="flex-1 shrink-0 w-full md:col-span-5 md:p-3 ">
                <Image className="pointer-events-none" src={activitiesImage} alt="What we do" height="7087" width="4912" unselectable="on" />
            </div>
        </InView>
        <InView
            as="section"
            variants={variants}
            viewOptions={{ margin: '0px 0px -200px 0px' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            id="members"
            className="max-w-(--max-app-width) w-full mx-auto p-4 md:p-16 flex flex-col items-start  gap-5 relative rounded-[24px] bg-card shadow-sm md:items-start md:gap-8 md:rounded-b-[20px] md:rounded-t-[40px]">
            <ButtonLink
                href="team"
                variant="outline"
                size="xs"
                className="absolute left-4 top-6 rounded-[14px] md:left-6 text-sm"
            >
                <Icon name="sparkles" className="fill-[#EEBDE0] stroke-1 text-neutral-800" />{" "}
                Our Team
                <Icon name="arrow-right" />
            </ButtonLink>
            <div className="flex flex-col justify-center pb-2 pl-4 pt-14 md:items-center">
                <div className="flex gap-2">
                    <div>
                        <h3 className="text-4xl opacity-85 font-bold tracking-tight">
                            Meet the Team
                        </h3>
                        <Separator className="my-2 bg-(--primary) h-0.5 rounded-full max-w-[200px]" />

                        <p className="text-muted-foreground">
                            Meet our amazing members who are passionate about technology and innovation.
                        </p>
                    </div>
                </div>
            </div>
            <CardCarousel
                images={allTeamMembers.map(member => ({ src: member.picture, alt: member.name }))}
                autoplayDelay={2000}
                showPagination={true}
                showNavigation={true}
                className="md:col-span-12"
            />
        </InView>
      
                
        <InView
            as="footer"
            variants={variants}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={cn(
                "z-40 w-full transition-all pt-5 pb-8 mt-auto",
                "bg-card border-b"
            )}>
            <div className="w-full max-w-(--max-app-width) mx-auto px-3 sm:px-6 lg:px-8 flex flex-col justify-center">
                <div className="mx-auto p-4 flex gap-4 items-center justify-center flex-wrap">
                    {navLinks.map((link) => {
                        return (
                            <ButtonLink key={link.href}
                                variant="default_light"
                                className="font-medium text-sm pl-4"
                                effect="shineHover" size="sm" href={link.href!}>
                                <span className="size-1 rounded-full bg-(--primary)" />
                                {link.title}
                                <Icon name="arrow-right" />
                            </ButtonLink>
                        );
                    })}

                </div>
                <Separator />
                <div className="flex w-full flex-col lg:flex-row lg:justify-around gap-6 items-start p-4">
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
                    <div>
                        <Link href="." aria-label="Logo">
                            <Image
                                height={160}
                                width={540}
                                className="h-16 w-auto"
                                src={clubLogo}
                                alt="logo"
                                loading="lazy"
                            />
                        </Link>

                    </div>
                    <div className="flex items-center gap-4">
                        {props.club?.connectedSocials && Object.entries(props.club?.connectedSocials).map(([key, value]) => {
                            if (!value) return null; // Skip if no URL is provided
                            return (
                                <ButtonLink key={key} variant="outline" effect="shineHover" size="icon_sm" href={value}>
                                    <Icon name={key as IconType} className="size-5 icon" />
                                </ButtonLink>
                            );
                        })}
                    </div>
                </div>
                <div className="mt-8 flex flex-col justify-between gap-4 border-t py-8 md:flex-row md:items-center md:text-left">
                    <p className="order-2 lg:order-1 text-xs font-medium text-muted-foreground">
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
        </InView>
    </>);
}
