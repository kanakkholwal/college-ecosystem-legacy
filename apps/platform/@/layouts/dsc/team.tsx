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
import teamImage from "./assets/images/team.svg";

import Image from "next/image";
import Link from "next/link";
import { appConfig } from "~/project.config";

import { FloatingElements } from "@/components/animation/floating-elements";
import { InView } from "@/components/animation/in-view";
import heroImage from "./assets/images/hero-team.jpg";
import { allTeamMembers, motionSettings } from "./constants";


const variants = motionSettings.variants;

export default function ClubTeamPage(props: PropsType["team"]) {
    const { navLinks, clubLogo, } = props.clubSettings;


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
            title="Our Team"
            description="The ones, who are making it happen..."
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
            <FloatingElements />

        </BaseHeroSection>
        <InView id="about"
            variants={variants}
            viewOptions={{ margin: '0px 0px -200px 0px' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full mx-auto p-4 md:p-16 flex flex-col items-start md:grid md:grid-cols-12 gap-5">

            <div


                className="flex-auto w-full md:col-span-5 p-4 prose max-w-full dark:prose-invert">

                <h2 className="text-4xl font-semibold mb-4 md:whitespace-nowrap">
                    Dreams and teams work together to make a change.

                    <Separator className="my-2 bg-(--quaternary) h-0.5 rounded-full max-w-[200px]" />
                </h2>
                <p className="max-w-5xl text-pretty">
                    Learning goes hand-in-hand with building new and cool stuff.
                    With our incredible team we aim to solve numerous problems in day-to-day life, and explore new heights in Technology!
                    We have got a strong team filled with caffeine addicted developers, gradients loving designers and and super-efficient managers.


                </p>

            </div>
            <div className="flex-1 shrink-0 w-full md:col-span-6 p-4 md:p-5">
                <Image className="pointer-events-none" src={teamImage} alt="Our team"
                    height="7087" width="4912" unselectable="on" />
            </div>
        </InView>
        <section id="members">
            {Object.entries(Object.groupBy(allTeamMembers,
                (member) => member.endYear > new Date().getFullYear() ? new Date().getFullYear() : member.endYear))
                .sort((a, b) => b[0].localeCompare(a[0]))
                .map(([year, members], idx) => {
                    return (
                        <InView
                            key={year}
                            as="section"
                            variants={variants}
                            viewOptions={{ margin: '0px 0px -200px 0px' }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className={cn("w-full mx-auto p-4 md:p-16",)}>
                            <h2 className="text-3xl font-semibold mb-4 text-center">
                                Team of {year}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {members?.map((member, index) => (
                                    <TeamMemberCard key={index} member={member} className={`float float-${idx > 10 ? (idx / 10) + 1 : idx + 1}`} />
                                ))}
                            </div>
                        </InView>
                    );
                })}


        </section>


        <InView
            as="footer"
            variants={variants}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={cn(
                "z-40 w-full transition-all pt-5 pb-8 mt-20",
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
                    <div>
                        {props.club?.connectedSocials ? <>

                            <p className="text-pretty text-sm text-muted-foreground mb-3">
                                Connect with {props.club.name}
                            </p>
                            <div className="flex items-center gap-2">
                                {Object.entries(props.club?.connectedSocials).map(([key, value]) => {
                                    if (!value) return null; // Skip if no URL is provided
                                    return (
                                        <ButtonLink key={key} variant="outline" effect="shineHover" size="icon_sm" href={value}>
                                            <Icon name={key as IconType} className="size-5 icon" />
                                        </ButtonLink>
                                    );
                                })}
                            </div>
                        </> : null}
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

interface TeamMemberCardProps {
    member: {
        name: string;
        position: string;
        picture: string;
        socials: {
            linkedin?: string;
            github?: string;
            twitter?: string;
        };
    };
    className?: string;
}

function TeamMemberCard({ member, className }: TeamMemberCardProps) {
    return (
        <div className={cn("bg-card group rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-102 relative overflow-hidden", className)}>
            {/* Decorative corner elements */}
            <div className="absolute top-0 left-0 w-16 h-16">
                <div className="absolute top-2 left-2 w-3 h-3 bg-(--primary) rounded-full" />
                <div className="absolute top-2 left-8 w-2 h-2 bg-(--secondary) rounded-full" />
                <div className="absolute top-6 left-2 w-2 h-2 bg-(--tertiary) rounded-full" />
                <div className="absolute top-6 left-6 w-2 h-2 bg-(--quaternary) rounded-full" />
            </div>

            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-(--secondary) via-(--primary) to-(--quaternary) opacity-20 rounded-bl-full" />

            {/* Yellow dots pattern */}
            <div className="absolute bottom-4 right-8">
                <div className="grid grid-cols-3 gap-1">
                    {[...Array(9)].map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-(--tertiary) rounded-full" />
                    ))}
                </div>
            </div>

            <div className="flex items-start gap-6">
                <div className="relative flex-shrink-0">
                    <div className="w-20 h-24 bg-gradient-to-br from-(--quaternary) to-green-400 rounded-lg overflow-hidden">
                        <Image
                            src={member.picture}
                            alt={member.name}
                            width={80}
                            height={96}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-foreground tracking-wide mb-1">
                        {member.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3">
                        {member.position}
                    </p>

                    <div className="flex items-center gap-2">
                        {Object.entries(member.socials).map(([key, url]) => {
                            if (!url) return null; // Skip if no URL is provided
                            return (
                                <ButtonLink key={key} variant="outline" size="icon_sm" href={url} target="_blank">
                                    <Icon name={key as IconType} />
                                </ButtonLink>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Gradient corner decoration */}
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-(--quaternary) via-blue-300 to-transparent opacity-30 rounded-tr-2xl" />
        </div>
    );
}