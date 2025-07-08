
import { cn } from '@/lib/utils';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { GitBranch, StarIcon, Users } from 'lucide-react';
import { getRepoStats } from '~/lib/github';
import { appConfig } from '~/project.config';
import { Icon, IconType } from '../icons';
import { Badge } from '../ui/badge';

interface GithubBannerProps {
    className?: string;
}

export default async function GithubBanner({ className }: GithubBannerProps) {
    const stats = await getRepoStats(appConfig.githubUri)


    return (<div className={cn("flex flex-col items-center pt-5 px-3 pb-10 md:pb-14 xl:pb-[60px]", className)}>
        <Badge variant="default" >
            <GitHubLogoIcon className="mr-1 h-4 w-4" />
            GitHub Community
        </Badge>
        <h5 className="mt-4 text-xl leading-7 font-semibold tracking-tight text-foreground md:text-center xl:text-3xl">
            Contribute to our community
        </h5>
        <p className="mt-2 text-lg text-muted-foreground md:text-center xl:mt-3 xl:text-lg">
            Dive into our code, contribute, and join a thriving open-source community.
        </p>
        <div className="mx-auto mt-10 flex w-full max-w-2xl flex-col items-center">
            <div
                data-slot="card"
                className="bg-card text-card-foreground relative flex w-full flex-col items-start gap-6 overflow-hidden rounded-2xl border border-border p-8 shadow-lg md:flex-row lg:items-center"
            >
                <div className="pointer-events-none absolute right-0 bottom-0 z-0 h-2/3 w-2/3">
                    <svg
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 fill-gray-400/30 stroke-gray-400/30 h-full w-full"
                        style={{
                            maskImage:
                                "radial-gradient(circle at 100% 100%, black 60%, transparent 100%)",
                            WebkitMaskImage:
                                "radial-gradient(circle at 100% 100%, black 60%, transparent 100%)",
                            opacity: "0.4",
                        }}
                    >
                        <defs>
                            <pattern
                                id=":S1:"
                                width={40}
                                height={40}
                                patternUnits="userSpaceOnUse"
                                x={-1}
                                y={-1}
                            >
                                <path d="M.5 40V.5H40" fill="none" strokeDasharray={0} />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" strokeWidth={0} fill="url(#:S1:)" />
                    </svg>
                </div>
                <div className="z-10 flex flex-shrink-0 flex-col items-start">
                    <a
                        href="https://github.com/shadcnblocks"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <svg
                            stroke="currentColor"
                            fill="currentColor"
                            strokeWidth={0}
                            viewBox="0 0 496 512"
                            className="mb-2 h-16 w-16 text-foreground"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
                        </svg>
                    </a>
                    <span className="text-xl font-semibold text-foreground">
                        {appConfig.name}
                    </span>
                    <a
                        href={appConfig.githubRepo}
                        target="_blank"
                        className="mt-1 text-sm text-muted-foreground underline hover:text-foreground"
                    >
                        github.com/{appConfig.githubUri.split('/')[0]}
                    </a>
                </div>
                <div className="z-10 flex flex-1 flex-col items-start">
                    <p className="mb-4 text-left text-muted-foreground">
                        Your contributions help us improve and expand our platform for everyone.
                    </p>
                    <div className="flex flex-col gap-4 text-sm md:flex-row md:gap-6">
                        <div className="flex items-center gap-1">
                            <StarIcon className="size-4 text-yellow-400" />
                            <span className="font-semibold text-foreground">{stats.stars}</span>
                            <span className="ml-1 text-muted-foreground">Stars</span>
                        </div>
                        <div className="flex items-center gap-1">

                            <GitBranch className="size-4 text-muted-foreground" />
                            <span className="font-semibold text-foreground">{stats.forks}</span>
                            <span className="ml-1 text-muted-foreground">Forks</span>
                        </div>
                        <div className="flex items-center gap-1">

                            <Users className="size-4 text-muted-foreground" />
                            <span className="font-semibold text-foreground">{stats.contributors}+</span>
                            <span className="ml-1 text-muted-foreground">Contributors</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="mt-8 flex justify-center gap-4 flex-wrap px-3">
            {(Object.entries(appConfig.socials) as [IconType, string][]).map(([key, value]) => {
                return (
                    <a
                        key={key}
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-24 flex-col items-center gap-2 rounded-xl border border-border bg-muted p-4 transition-all hover:shadow-md"
                    >

                        <Icon name={key} className="size-6 icon" />
                        <span className="text-xs font-medium capitalize text-muted-foreground">
                            {key}
                        </span>
                    </a>
                )
            })}
        </div>
    </div>
    );
}