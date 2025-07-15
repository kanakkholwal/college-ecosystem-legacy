
import { cn } from '@/lib/utils';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { GitBranch, StarIcon, Users } from 'lucide-react';
import { getRepoStats } from '~/lib/third-party/github';
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
                        href={appConfig.githubRepo}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Icon name="github" className="mb-2 h-16 w-16 text-foreground"/>
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
